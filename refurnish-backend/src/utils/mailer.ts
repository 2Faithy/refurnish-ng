import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Refurnish <noreply@refurnishng.com>";

function emailShell(title: string, bodyHtml: string) {
  return `
  <div style="background-color:#FAF4EC; padding:40px 20px; font-family:'Segoe UI', Arial, sans-serif;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(33,16,0,0.08);">
      <div style="background:#211000; padding:28px 32px;">
        <span style="color:#FAF4EC; font-size:20px; font-weight:600; letter-spacing:-0.5px;">Refurnish</span>
      </div>
      <div style="padding:36px 32px;">
        <h1 style="color:#211000; font-size:22px; font-weight:600; margin:0 0 12px 0;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="background:#E8CEB0; padding:18px 32px; text-align:center;">
        <span style="color:#211000; font-size:12px; opacity:0.6;">© ${new Date().getFullYear()} Refurnish NG. All rights reserved.</span>
      </div>
    </div>
  </div>`;
}

function codeBlock(code: string) {
  return `
  <div style="background:#FAF4EC; border:1px solid #E8CEB0; border-radius:12px; padding:20px; text-align:center; margin:20px 0;">
    <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#B66B44;">${code}</span>
  </div>`;
}

export async function sendVerificationEmail(to: string, code: string, name: string) {
  const html = emailShell(
    "Verify your email",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, welcome to Refurnish. Use the code below to verify your email address.
    </p>
    ${codeBlock(code)}
    <p style="color:#211000; opacity:0.5; font-size:12px; margin:0;">
      This code expires in 15 minutes. If you didn't request this, you can ignore this email.
    </p>`
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your Refurnish account",
    html,
  });
}

export async function sendPasswordResetEmail(to: string, code: string) {
  const html = emailShell(
    "Reset your password",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      We received a request to reset your password. Use the code below to continue.
    </p>
    ${codeBlock(code)}
    <p style="color:#211000; opacity:0.5; font-size:12px; margin:0;">
      This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.
    </p>`
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your Refurnish password",
    html,
  });
}
