import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";
import { generateCode } from "../utils/devCode";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/mailer";

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const devCode = generateCode();

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        verificationCode: devCode,
        emailVerified: false,
      },
    });

    await sendVerificationEmail(email, devCode, name);

    return res.status(201).json({
      message: "Account created. Please check your email for a verification code.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        needsEmailVerification: true,
        email: user.email,
      });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    const devCode = generateCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    await prisma.user.update({
      where: { email },
      data: { resetCode: devCode, resetCodeExpiry },
    });

    await sendPasswordResetEmail(email, devCode);

    return res.status(200).json({
      message: "Reset code sent to your email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code) {
      return res.status(400).json({ message: "Invalid or expired code." });
    }

    if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { emailVerified: true, verificationCode: null },
    });

    const token = signToken({ userId: updated.id, email: updated.email });

    return res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function resendVerificationCode(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }
    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }

    const devCode = generateCode();
    await prisma.user.update({
      where: { email },
      data: { verificationCode: devCode },
    });

    await sendVerificationEmail(email, devCode, user.name);

    return res.status(200).json({ message: "Code resent to your email." });
  } catch (err) {
    console.error("Resend code error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
