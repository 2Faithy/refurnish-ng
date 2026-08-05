import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendBankDetailsRequestEmail, sendPayoutSentEmail } from "../utils/mailer";

export async function getMyPayouts(req: AuthRequest, res: Response) {
  try {
    const payouts = await prisma.payout.findMany({
      where: { sellerId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ payouts });
  } catch (err) {
    console.error("Get my payouts error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function reportPayoutIssue(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Please describe the issue (at least 10 characters)." });
    }

    const payout = await prisma.payout.findUnique({ where: { id } });
    if (!payout || payout.sellerId !== req.userId) {
      return res.status(404).json({ message: "Payout not found." });
    }

    const updated = await prisma.payout.update({
      where: { id },
      data: { issueReported: true, issueDescription: description.trim(), issueStatus: "open" },
    });

    return res.status(200).json({ message: "Issue reported. Our team will look into it.", payout: updated });
  } catch (err) {
    console.error("Report payout issue error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getAllPayouts(_req: AuthRequest, res: Response) {
  try {
    const payouts = await prisma.payout.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankDetailsUpdatedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ payouts });
  } catch (err) {
    console.error("Get all payouts error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function requestBankDetails(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const payout = await prisma.payout.findUnique({ where: { id }, include: { seller: true } });
    if (!payout) return res.status(404).json({ message: "Payout not found." });

    const paymentsUrl = `${process.env.FRONTEND_URL}/dashboard/payments`;
    await sendBankDetailsRequestEmail(
      payout.seller.email,
      payout.seller.name,
      payout.netAmount,
      payout.itemTitle,
      paymentsUrl
    );

    return res.status(200).json({ message: "Reminder email sent to seller." });
  } catch (err) {
    console.error("Request bank details error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function markPayoutPaid(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { receiptUrl } = req.body;
    if (!receiptUrl) return res.status(400).json({ message: "Upload a payment receipt first." });

    const payout = await prisma.payout.findUnique({ where: { id }, include: { seller: true } });
    if (!payout) return res.status(404).json({ message: "Payout not found." });
    if (payout.status === "paid") return res.status(400).json({ message: "This payout has already been paid." });
    if (!payout.seller.bankName || !payout.seller.accountNumber) {
      return res.status(400).json({ message: "Seller hasn't added bank details yet." });
    }

    const updated = await prisma.payout.update({
      where: { id },
      data: { status: "paid", receiptUrl, paidAt: new Date() },
    });

    const paymentsUrl = `${process.env.FRONTEND_URL}/dashboard/payments`;
    await sendPayoutSentEmail(
      payout.seller.email,
      payout.seller.name,
      payout.netAmount,
      payout.itemTitle,
      receiptUrl,
      paymentsUrl
    );

    return res.status(200).json({ message: "Payout marked as paid.", payout: updated });
  } catch (err) {
    console.error("Mark payout paid error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}