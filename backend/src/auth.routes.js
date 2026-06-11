import express from "express";
import { pool } from "./db.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.js";
import passport from "./passport.js";
import {
  hashPassword,
  verifyPassword,
  sha256,
  randomToken,
  randomCode,
  getCookie,
} from "./security.js";

const router = express.Router();

const SESSION_COOKIE = "rf_session";
const SESSION_DAYS = 7;

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
}

async function createSession(req, res, userId) {
  const token = randomToken();
  const tokenHash = sha256(token);

  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await pool.query(
    `
    INSERT INTO sessions (
      user_id,
      token_hash,
      user_agent,
      ip_address,
      expires_at
    )
    VALUES ($1, $2, $3, $4, $5)
    `,
    [
      userId,
      tokenHash,
      req.headers["user-agent"] || null,
      req.ip || null,
      expiresAt,
    ]
  );

  setSessionCookie(res, token);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    emailVerified: Boolean(user.email_verified_at),
    profileImage: user.profile_image,
    idUploaded: user.id_uploaded,
    idVerified: Boolean(user.id_verified_at),
    createdAt: user.created_at,
  };
}

/**
 * SIGN UP
 */
router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const existing = await pool.query(
      `SELECT id, email_verified_at FROM users WHERE email = $1`,
      [email]
    );

    if (existing.rows.length > 0 && existing.rows[0].email_verified_at) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    let userId;

    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
    } else {
      const passwordHash = await hashPassword(password);

      const result = await pool.query(
        `
        INSERT INTO users (name, email, phone, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [name, email, phone || null, passwordHash]
      );

      userId = result.rows[0].id;
    }

    const code = randomCode();
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO email_verification_codes (user_id, code_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [userId, codeHash, expiresAt]
    );

    /**
     * Development-only:
     * Until we add email sending, the code prints in backend terminal.
     */
    console.log(`Verification code for ${email}: ${code}`);
    await sendVerificationEmail(email, code);

    return res.status(201).json({
      message: "Account created. Please verify your email.",
      email,
      userId,
      devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
});

/**
 * VERIFY EMAIL
 */
router.post("/verify-email", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const code = String(req.body.code || "").trim();

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required.",
      });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const user = userResult.rows[0];

    const codeResult = await pool.query(
      `
      SELECT *
      FROM email_verification_codes
      WHERE user_id = $1
        AND used_at IS NULL
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user.id]
    );

    if (codeResult.rows.length === 0) {
      return res.status(400).json({
        message: "Verification code expired. Please request a new one.",
      });
    }

    const verification = codeResult.rows[0];

    if (verification.code_hash !== sha256(code)) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    await pool.query(
      `
      UPDATE users
      SET email_verified_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      `,
      [user.id]
    );

    await pool.query(
      `
      UPDATE email_verification_codes
      SET used_at = NOW()
      WHERE id = $1
      `,
      [verification.id]
    );

    await createSession(req, res, user.id);

    const updatedUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      user.id,
    ]);

    return res.json({
      message: "Email verified successfully.",
      user: sanitizeUser(updatedUser.rows[0]),
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      message: "Something went wrong while verifying your email.",
    });
  }
});

/**
 * RESEND VERIFICATION CODE
 */
router.post("/resend-verification", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified_at) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    const code = randomCode();

    await pool.query(
      `
      INSERT INTO email_verification_codes (user_id, code_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [user.id, sha256(code), new Date(Date.now() + 15 * 60 * 1000)]
    );

    console.log(`Verification code for ${email}: ${code}`);
    await sendVerificationEmail(email, code);

    return res.json({
      message: "Verification code resent.",
      devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      message: "Could not resend verification code.",
    });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.email_verified_at) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
        needsEmailVerification: true,
        email: user.email,
      });
    }

    await createSession(req, res, user.id);

    return res.json({
      message: "Logged in successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
});

/**
 * CURRENT USER
 */
router.get("/me", async (req, res) => {
  try {
    const token = getCookie(req, SESSION_COOKIE);

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated.",
      });
    }

    const tokenHash = sha256(token);

    const result = await pool.query(
      `
      SELECT users.*
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = $1
        AND sessions.expires_at > NOW()
      LIMIT 1
      `,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      clearSessionCookie(res);

      return res.status(401).json({
        message: "Session expired.",
      });
    }

    return res.json({
      user: sanitizeUser(result.rows[0]),
    });
  } catch (error) {
    console.error("Me error:", error);

    return res.status(500).json({
      message: "Could not fetch current user.",
    });
  }
});

/**
 * LOGOUT
 */
router.post("/logout", async (req, res) => {
  try {
    const token = getCookie(req, SESSION_COOKIE);

    if (token) {
      await pool.query(`DELETE FROM sessions WHERE token_hash = $1`, [
        sha256(token),
      ]);
    }

    clearSessionCookie(res);

    return res.json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Could not log out.",
    });
  }
});

/**
 * FORGOT PASSWORD — send reset code
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists
      return res.json({
        message: "If that email exists, a reset code has been sent.",
      });
    }

    const user = userResult.rows[0];
    const code = randomCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `INSERT INTO password_reset_codes (user_id, code_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, sha256(code), expiresAt]
    );

    console.log(`Password reset code for ${email}: ${code}`);
    await sendPasswordResetEmail(email, code);

    return res.json({
      message: "If that email exists, a reset code has been sent.",
      devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

/**
 * RESET PASSWORD — verify code and set new password
 */
router.post("/reset-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const code = String(req.body.code || "").trim();
    const password = String(req.body.password || "");

    if (!email || !code || !password) {
      return res
        .status(400)
        .json({ message: "Email, code, and password are required." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    const codeResult = await pool.query(
      `SELECT * FROM password_reset_codes
       WHERE user_id = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    if (codeResult.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Reset code expired. Please request a new one." });
    }

    const reset = codeResult.rows[0];

    if (reset.code_hash !== sha256(code)) {
      return res.status(400).json({ message: "Invalid reset code." });
    }

    const passwordHash = await hashPassword(password);

    await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, user.id]
    );

    await pool.query(
      `UPDATE password_reset_codes SET used_at = NOW() WHERE id = $1`,
      [reset.id]
    );

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

/**
 * GOOGLE OAUTH
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    await createSession(req, res, req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

/**
 * FACEBOOK OAUTH
 */
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    await createSession(req, res, req.user.id);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

export default router;
