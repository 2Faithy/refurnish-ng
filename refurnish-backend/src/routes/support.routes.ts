import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  getMyTicket,
  updateTicketMeta,
  sendSupportMessage,
  resolveMyTicket,
  getAllTickets,
  getTicketMessages,
  sendAgentReply,
  resolveTicket,
} from "../controllers/support.controller";

const router = Router();

router.get("/mine", requireAuth, getMyTicket);
router.patch("/mine", requireAuth, updateTicketMeta);
router.post("/mine/messages", requireAuth, sendSupportMessage);
router.post("/mine/resolve", requireAuth, resolveMyTicket);

router.get("/admin/tickets", requireAdmin, getAllTickets);
router.get("/admin/tickets/:id/messages", requireAdmin, getTicketMessages);
router.post("/admin/tickets/:id/messages", requireAdmin, sendAgentReply);
router.post("/admin/tickets/:id/resolve", requireAdmin, resolveTicket);

export default router;