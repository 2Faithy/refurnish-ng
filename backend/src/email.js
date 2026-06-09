import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, code) {
  await resend.emails.send({
    from: "Refurnish <people@refurnishng.com>",
    to: toEmail,
    subject: "Verify your Refurnish account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #FAF4EC;">
        <h2 style="font-size: 24px; color: #211000;">Verify your email</h2>
        <p style="color: #555;">Use the code below to verify your Refurnish account. It expires in 15 minutes.</p>
        <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #B66B44; margin: 32px 0; text-align: center;">
          ${code}
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't create a Refurnish account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(toEmail, code) {
  await resend.emails.send({
    from: "Refurnish <people@refurnishng.com>",
    to: toEmail,
    subject: "Reset your Refurnish password",
    html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #FAF4EC;">
          <h2 style="font-size: 24px; color: #211000;">Reset your password</h2>
          <p style="color: #555;">Use the code below to reset your Refurnish password. It expires in 15 minutes.</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #B66B44; margin: 32px 0; text-align: center;">
            ${code}
          </div>
          <p style="color: #999; font-size: 12px;">If you didn't request a password reset, ignore this email.</p>
        </div>
      `,
  });
}
