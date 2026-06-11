import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { pool } from "./db.js";

async function findOrCreateOAuthUser({ provider, oauthId, email, name }) {
  // 1. Check if user already linked with this provider
  let result = await pool.query(
    `SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2`,
    [provider, oauthId]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // 2. Check if a user exists with this email (link accounts)
  result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

  if (result.rows.length > 0) {
    const updated = await pool.query(
      `UPDATE users
       SET oauth_provider = $1, oauth_id = $2, email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [provider, oauthId, result.rows[0].id]
    );
    return updated.rows[0];
  }

  // 3. Create new user
  const inserted = await pool.query(
    `INSERT INTO users (name, email, password_hash, oauth_provider, oauth_id, email_verified_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [name, email, "oauth_no_password", provider, oauthId]
  );

  return inserted.rows[0];
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const user = await findOrCreateOAuthUser({
          provider: "google",
          oauthId: profile.id,
          email,
          name: profile.displayName,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.local`;
        const user = await findOrCreateOAuthUser({
          provider: "facebook",
          oauthId: profile.id,
          email,
          name: profile.displayName,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
