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

export async function sendOrderPendingEmail(
  to: string,
  name: string,
  reference: string,
  total: string
) {
  const html = emailShell(
    "We're confirming your payment",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, we've received your order <strong>${reference}</strong> for ₦${Number(total).toLocaleString("en-NG")}.
    </p>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0;">
      We're confirming your payment and will get back to you shortly — usually within a few hours.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `We're confirming your payment — ${reference}`,
    html,
  });

  if (result.error) console.error("Resend error (order pending):", result.error);
  return result;
}

export async function sendPaymentConfirmedEmail(to: string, name: string, reference: string) {
  const html = emailShell(
    "Payment confirmed!",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, your payment for order <strong>${reference}</strong> has been confirmed.
    </p>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      We're reaching out to the seller now to make sure your item is still available for pickup.
      We'll get back to you shortly with next steps.
    </p>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0;">
      If the item is no longer available, we'll refund your payment immediately — no action needed from you.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Payment confirmed — ${reference}`,
    html,
  });

  if (result.error) console.error("Resend error (payment confirmed):", result.error);
  return result;
}

export async function sendSellerAvailabilityRequestEmail(
  to: string,
  name: string,
  items: any[],
  confirmUrl: string
) {
  const itemsHtml = (items || [])
    .map(
      (item: any) => `
      <div style="border-top:1px solid #21100014; padding:12px 0;">
        <p style="color:#211000; font-size:13px; font-weight:700; margin:0;">${item.itemTitle}</p>
        <p style="color:#211000; opacity:0.6; font-size:12px; margin:4px 0 0 0;">Qty: ${item.quantity}</p>
      </div>`
    )
    .join("");

  const html = emailShell(
    "Your item has been bought!",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 12px 0;">
      Hi ${name}, great news — someone has purchased the following item(s) from your listing:
    </p>

    ${itemsHtml}

    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:16px 0;">
      Please confirm the item is still available so we can arrange pickup with the buyer.
    </p>

    <div style="text-align:center; margin:20px 0;">
      <a href="${confirmUrl}" style="display:inline-block; background:#B66B44; color:#ffffff; font-weight:700; font-size:14px; text-decoration:none; padding:12px 28px; border-radius:999px;">
        Confirm availability
      </a>
    </div>

    <p style="color:#211000; opacity:0.5; font-size:12px; margin:0;">
      This link will let you confirm whether the item is available, or let us know if it isn't so we can refund the buyer.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your item has been bought — please confirm availability",
    html,
  });

  if (result.error) console.error("Resend error (seller availability request):", result.error);
  return result;
}

export async function sendPickupReadyEmail(
  to: string,
  name: string,
  reference: string,
  items: any[]
) {
  const itemsHtml = (items || [])
    .map(
      (item: any) => `
      <div style="border-top:1px solid #21100014; padding:12px 0;">
        <p style="color:#211000; font-size:13px; font-weight:700; margin:0 0 4px 0;">${item.itemTitle}</p>
        <p style="color:#211000; opacity:0.7; font-size:12px; margin:0;">Seller: ${item.sellerName || "N/A"} · ${item.sellerPhone || ""}</p>
        <p style="color:#211000; opacity:0.7; font-size:12px; margin:0;">Location: ${item.sellerAddress || ""}, ${item.sellerState || ""}</p>
      </div>`
    )
    .join("");

  const html = emailShell(
    "Your item is ready for pickup!",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 12px 0;">
      Hi ${name}, good news — the seller has confirmed your item for order <strong>${reference}</strong> is available. Here are the details so you can arrange pickup:
    </p>

    ${itemsHtml}

    <div style="background:#FAF4EC; border:1px solid #E8CEB0; border-radius:12px; padding:16px; margin:16px 0;">
      <p style="color:#211000; font-size:13px; font-weight:700; margin:0 0 8px 0;">Safety tips</p>
      <ul style="color:#211000; opacity:0.75; font-size:12px; line-height:1.7; margin:0; padding-left:18px;">
        <li>Meet in public, well-lit places whenever possible</li>
        <li>Avoid meeting late at night</li>
        <li>Inspect the item carefully before completing the handover</li>
        <li>Never send additional payment outside the platform</li>
      </ul>
    </div>

    <p style="color:#211000; opacity:0.7; font-size:13px; line-height:1.6; margin:0;">
      If anything feels wrong, the item isn't as described, or you suspect fraud, report it to us immediately by replying to this email.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your item is ready for pickup — ${reference}`,
    html,
  });

  if (result.error) console.error("Resend error (pickup ready):", result.error);
  return result;
}

export async function sendItemUnavailableEmail(
  to: string,
  name: string,
  reference: string,
  items: any[]
) {
  const itemsHtml = (items || [])
    .map((item: any) => `<li style="margin-bottom:4px;">${item.itemTitle}</li>`)
    .join("");

  const html = emailShell(
    "An update on your order",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, unfortunately the seller let us know the following item(s) from order <strong>${reference}</strong> are no longer available:
    </p>
    <ul style="color:#211000; opacity:0.75; font-size:13px; margin:0 0 12px 0; padding-left:18px;">
      ${itemsHtml}
    </ul>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0;">
      We're sorry for the inconvenience. Your payment will be refunded immediately — no action needed from you.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Item unavailable — refund initiated for ${reference}`,
    html,
  });

  if (result.error) console.error("Resend error (item unavailable):", result.error);
  return result;
}

export async function sendOrderRejectedEmail(
  to: string,
  name: string,
  reference: string,
  reason: string
) {
  const whatsappNumber = "08140190985";

  const html = emailShell(
    "An update on your payment",
    `
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
      Hi ${name}, we were unable to confirm payment for order <strong>${reference}</strong>.
    </p>
    <div style="background:#FAF4EC; border:1px solid #E8CEB0; border-radius:12px; padding:16px; margin:16px 0;">
      <p style="color:#211000; opacity:0.5; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 6px 0;">Reason</p>
      <p style="color:#211000; opacity:0.75; font-size:14px; margin:0;">${reason}</p>
    </div>
    <p style="color:#211000; opacity:0.7; font-size:14px; line-height:1.6; margin:0;">
      If you believe this was a mistake, reach out to us on WhatsApp at
      <strong>${whatsappNumber}</strong> — we're online 24/7 for immediate assistance.
    </p>`
  );

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `An update on your payment — ${reference}`,
    html,
  });

  if (result.error) console.error("Resend error (order rejected):", result.error);
  return result;
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
