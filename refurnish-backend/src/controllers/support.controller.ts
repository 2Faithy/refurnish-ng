import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { formatTicketReference } from "../utils/ticketReference";
import { sendNewSupportTicketEmail, sendSupportReplyEmail } from "../utils/mailer";

function withReference(ticket: any) {
  return { ...ticket, reference: formatTicketReference(ticket.id) };
}

async function getOpenTicket(userId: string) {
  return prisma.supportTicket.findFirst({
    where: { userId, status: { not: "resolved" } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyTicket(req: AuthRequest, res: Response) {
  try {
    const ticket = await getOpenTicket(req.userId!);
    if (!ticket) return res.status(200).json({ ticket: null, messages: [] });

    await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: { userLastReadAt: new Date() },
    });

    const messages = await prisma.supportMessage.findMany({
      where: { ticketId: ticket.id },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ ticket: withReference(ticket), messages });
  } catch (err) {
    console.error("Get my ticket error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function updateTicketMeta(req: AuthRequest, res: Response) {
  try {
    const { topic, orderId } = req.body;
    let ticket = await getOpenTicket(req.userId!);

    if (!ticket) {
      ticket = await prisma.supportTicket.create({
        data: { userId: req.userId!, topic: topic || "general", orderId: orderId || null },
      });
    } else {
      ticket = await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          ...(topic ? { topic } : {}),
          ...(orderId !== undefined ? { orderId: orderId || null } : {}),
        },
      });
    }

    return res.status(200).json({ ticket: withReference(ticket) });
  } catch (err) {
    console.error("Update ticket meta error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function sendSupportMessage(req: AuthRequest, res: Response) {
  try {
    const { text, attachments } = req.body;
    if (!text?.trim() && !(attachments?.length > 0)) {
      return res.status(400).json({ message: "Message can't be empty." });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found." });

    let ticket = await getOpenTicket(req.userId!);
    if (!ticket) {
      ticket = await prisma.supportTicket.create({
        data: { userId: req.userId!, status: "waiting_for_agent" },
      });
    } else if (ticket.status === "open") {
      ticket = await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { status: "waiting_for_agent" },
      });
    }

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        role: "user",
        text: text?.trim() || "Sent an attachment",
        attachments: attachments || undefined,
      },
    });

    await prisma.supportTicket.update({ where: { id: ticket.id }, data: { updatedAt: new Date() } });

    const reference = formatTicketReference(ticket.id);
    const ticketUrl = `${process.env.FRONTEND_URL}/admin?tab=support&ticket=${ticket.id}`;
    await sendNewSupportTicketEmail(reference, user.name, user.email, ticket.topic, message.text, ticketUrl);

    return res.status(201).json({ ticket: withReference(ticket), message });
  } catch (err) {
    console.error("Send support message error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function resolveMyTicket(req: AuthRequest, res: Response) {
  try {
    const ticket = await getOpenTicket(req.userId!);
    if (!ticket) return res.status(200).json({ message: "No open ticket." });

    await prisma.supportTicket.update({ where: { id: ticket.id }, data: { status: "resolved" } });
    return res.status(200).json({ message: "Ticket closed." });
  } catch (err) {
    console.error("Resolve my ticket error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

// ── Admin ──

export async function getAllTickets(_req: AuthRequest, res: Response) {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, reference: true, total: true, status: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    return res.status(200).json({ tickets: tickets.map(withReference) });
  } catch (err) {
    console.error("Get all tickets error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function getTicketMessages(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, reference: true, total: true, status: true } },
      },
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    await prisma.supportTicket.update({ where: { id }, data: { adminLastReadAt: new Date() } });

    const messages = await prisma.supportMessage.findMany({
      where: { ticketId: id },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ ticket: withReference(ticket), messages });
  } catch (err) {
    console.error("Get ticket messages error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function sendAgentReply(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message can't be empty." });

    const ticket = await prisma.supportTicket.findUnique({ where: { id }, include: { user: true } });
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });

    const message = await prisma.supportMessage.create({
      data: { ticketId: id, role: "agent", text: text.trim() },
    });

    await prisma.supportTicket.update({ where: { id }, data: { status: "open", updatedAt: new Date() } });

    const reference = formatTicketReference(ticket.id);
    const ticketUrl = `${process.env.FRONTEND_URL}/support`;
    await sendSupportReplyEmail(ticket.user.email, ticket.user.name, reference, message.text, ticketUrl);

    return res.status(201).json({ message });
  } catch (err) {
    console.error("Send agent reply error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export async function resolveTicket(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ticket ID." });
    }

    const ticket = await prisma.supportTicket.update({ where: { id }, data: { status: "resolved" } });
    return res.status(200).json({ ticket: withReference(ticket) });
  } catch (err) {
    console.error("Resolve ticket error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}