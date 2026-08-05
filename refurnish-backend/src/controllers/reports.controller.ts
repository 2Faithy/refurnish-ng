import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendReportEmail } from "../utils/mailer";

export async function submitReport(req: AuthRequest, res: Response) {
  try {
    const { conversationId, reason, details } = req.body;
    if (!conversationId || !reason) {
      return res.status(400).json({ message: "conversationId and reason are required." });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    if (!conversation || (conversation.buyerId !== req.userId && conversation.sellerId !== req.userId)) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isBuyer = conversation.buyerId === req.userId;
    const reporter = isBuyer ? conversation.buyer : conversation.seller;
    const reported = isBuyer ? conversation.seller : conversation.buyer;

    const conversationUrl = `${process.env.FRONTEND_URL}/dashboard/messages?conversationId=${conversation.id}`;

    await sendReportEmail(reporter.name, reporter.email, reported.name, reason, details || "", conversationUrl);

    return res.status(200).json({ message: "Report submitted. Our team will review it shortly." });
  } catch (err) {
    console.error("Submit report error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}