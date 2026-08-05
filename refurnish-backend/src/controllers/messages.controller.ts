import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Same protections as the old client-side filter, enforced server-side —
// this is the actual source of truth now.
// Always blocked, checkout or not — these leak personal contact/payment info.
const ALWAYS_BLOCKED_PATTERNS = [
  { regex: /\b0[7-9][01]\d{8}\b/, label: "phone number" },
  { regex: /\+234[7-9][01]\d{8,9}\b/, label: "phone number" },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, label: "email address" },
  { regex: /https?:\/\/|www\.|\.com\b|\.ng\b|\.org\b/, label: "website link" },
  { regex: /\b(account number|acct no|sort code|routing number|bank name)\b/i, label: "bank details" },
  { regex: /\b(whatsapp|telegram|instagram dm|twitter dm|tiktok dm)\b/i, label: "social contact" },
  { regex: /\b(call me|text me|reach me on|contact me on|hit me up)\b/i, label: "off-platform contact" },
  { regex: /\b(pay directly|pay offline|outside platform|skip escrow|avoid refurnish|cash payment|direct transfer)\b/i, label: "off-platform payment" },
];

// Only blocked before checkout — arranging a meetup pre-purchase is how off-platform
// deals happen. Once a real order exists, pickup coordination is legitimate.
const PRE_CHECKOUT_ONLY_PATTERNS = [
  { regex: /\b(meet( me)? at|can we meet|let'?s meet|meet up)\b/i, label: "meetup arrangement" },
  { regex: /\bi'?m at\b|\bi am at\b/i, label: "location sharing" },
  { regex: /\bmy location is\b|\bcome to\b/i, label: "location sharing" },
];

function scanMessage(text: string, checkedOut: boolean) {
  const patterns = checkedOut ? ALWAYS_BLOCKED_PATTERNS : [...ALWAYS_BLOCKED_PATTERNS, ...PRE_CHECKOUT_ONLY_PATTERNS];
  const violations: string[] = [];
  for (const p of patterns) {
    if (p.regex.test(text)) violations.push(p.label);
  }
  return { clean: violations.length === 0, violations: [...new Set(violations)] };
}

export async function getOrCreateConversation(req: AuthRequest, res: Response) {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ message: "listingId is required." });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    if (listing.status !== "active") {
      return res.status(400).json({ message: "This listing isn't available for negotiation." });
    }
    if (listing.sellerId === req.userId) {
      return res.status(400).json({ message: "You can't message yourself about your own listing." });
    }

    let conversation = await prisma.conversation.findUnique({
      where: { listingId_buyerId: { listingId, buyerId: req.userId! } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { listingId, buyerId: req.userId!, sellerId: listing.sellerId },
      });
    }

    return res.status(200).json({ conversation });
  } catch (err) {
    console.error("Get or create conversation error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getMyConversations(req: AuthRequest, res: Response) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ buyerId: req.userId }, { sellerId: req.userId }] },
      include: {
        listing: true,
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    const withUnread = await Promise.all(
      conversations.map(async (c) => {
        const isBuyer = c.buyerId === req.userId;
        const lastReadAt = isBuyer ? c.buyerLastReadAt : c.sellerLastReadAt;
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: c.id,
            role: isBuyer ? "seller" : "buyer",
            ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
          },
        });
        return { ...c, myRole: isBuyer ? "buyer" : "seller", unreadCount };
      })
    );

    return res.status(200).json({ conversations: withUnread });
  } catch (err) {
    console.error("Get my conversations error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getConversationMessages(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        listing: true,
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    if (!conversation || (conversation.buyerId !== req.userId && conversation.sellerId !== req.userId)) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const isBuyer = conversation.buyerId === req.userId;
    await prisma.conversation.update({
      where: { id },
      data: isBuyer ? { buyerLastReadAt: new Date() } : { sellerLastReadAt: new Date() },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ conversation: { ...conversation, myRole: isBuyer ? "buyer" : "seller" }, messages });
  } catch (err) {
    console.error("Get conversation messages error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function sendMessage(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Message can't be empty." });

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation || (conversation.buyerId !== req.userId && conversation.sellerId !== req.userId)) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const scan = scanMessage(text, !!conversation.orderId);
    if (!scan.clean) {
      return res.status(400).json({
        message: `For your safety, sharing ${scan.violations.join(", ")} isn't allowed. Keep all communication and payments on Refurnish.`,
      });
    }

    const role = conversation.sellerId === req.userId ? "seller" : "buyer";
    const message = await prisma.message.create({
      data: { conversationId: id, senderId: req.userId, role, type: "text", text: text.trim() },
    });

    await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

    return res.status(201).json({ message });
  } catch (err) {
    console.error("Send message error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function sendOffer(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ message: "Enter a valid offer amount." });

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation || conversation.buyerId !== req.userId) {
      return res.status(403).json({ message: "Only the buyer can make an offer." });
    }
    if (conversation.offerStatus === "accepted") {
      return res.status(400).json({ message: "An offer has already been accepted on this listing." });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.userId,
        role: "buyer",
        type: "offer",
        text: `Offered ₦${amount.toLocaleString()}`,
        offerAmount: String(amount),
      },
    });

    const updated = await prisma.conversation.update({
      where: { id },
      data: { offerAmount: String(amount), offerStatus: "pending", updatedAt: new Date() },
    });

    return res.status(201).json({ message, conversation: updated });
  } catch (err) {
    console.error("Send offer error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function respondToOffer(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { action } = req.body; // "accept" | "reject"
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action must be 'accept' or 'reject'." });
    }

    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation || conversation.sellerId !== req.userId) {
      return res.status(403).json({ message: "Only the seller can respond to an offer." });
    }
    if (conversation.offerStatus !== "pending") {
      return res.status(400).json({ message: "There's no pending offer to respond to." });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";
    const updated = await prisma.conversation.update({
      where: { id },
      data: {
        offerStatus: newStatus,
        agreedPrice: newStatus === "accepted" ? conversation.offerAmount : null,
        updatedAt: new Date(),
      },
    });

    const systemText =
      newStatus === "accepted"
        ? `Seller accepted the offer of ₦${Number(conversation.offerAmount).toLocaleString()}. You can now check out at this price.`
        : `Seller declined the offer of ₦${Number(conversation.offerAmount).toLocaleString()}.`;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        role: "system",
        type: newStatus === "accepted" ? "offer_accepted" : "offer_rejected",
        text: systemText,
      },
    });

    return res.status(200).json({ conversation: updated, message });
  } catch (err) {
    console.error("Respond to offer error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}