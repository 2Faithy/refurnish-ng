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

export async function sendListingSubmittedEmail(to: string, name: string, itemTitle: string) {
  const html = emailShell(
    "We've got your listing!",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, thanks for listing <strong>"${itemTitle}"</strong> on Refurnish.
    </p>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0;">
      Our team will review it shortly — we'll reach out within a few hours to let
      you know if it's approved or if we need any changes.
    </p>`
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "We've got your listing!",
    html,
  });
}

export async function sendListingApprovedEmail(
  to: string,
  name: string,
  itemTitle: string,
  shopUrl: string
) {
  const html = emailShell(
    "Your listing is live! 🎉",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, great news — <strong>"${itemTitle}"</strong> has been approved and is now live.
    </p>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
      Head over to the shop page to check it out, and share it on WhatsApp,
      Telegram, or Facebook to help it sell faster.
    </p>
    <div style="text-align:center;">
      <a href="${shopUrl}" style="display:inline-block; background:#B66B44; color:#ffffff; font-weight:700; font-size:14px; text-decoration:none; padding:12px 28px; border-radius:999px;">
        View your listing
      </a>
    </div>`
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your listing is live! 🎉",
    html,
  });
}

export async function sendListingRejectedEmail(
  to: string,
  name: string,
  itemTitle: string,
  reason: string,
  editUrl: string
) {
  const html = emailShell(
    "An update on your listing",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, unfortunately <strong>"${itemTitle}"</strong> wasn't approved this time.
    </p>
    <div style="background:#FAF4EC; border:1px solid #E8CEB0; border-radius:12px; padding:16px; margin:16px 0;">
      <p style="color:#211000; opacity:0.5; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 6px 0;">Reason</p>
      <p style="color:#211000; opacity:0.75; font-size:14px; margin:0;">${reason}</p>
    </div>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
      You can fix the issue above and resubmit without starting over.
    </p>
    <div style="text-align:center;">
      <a href="${editUrl}" style="display:inline-block; background:#B66B44; color:#ffffff; font-weight:700; font-size:14px; text-decoration:none; padding:12px 28px; border-radius:999px;">
        Edit & resubmit listing
      </a>
    </div>`
  );

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "An update on your listing",
    html,
  });
}
