import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  sendOffer,
  respondToOffer,
} from "../controllers/messages.controller";

const router = Router();

router.post("/", requireAuth, getOrCreateConversation);
router.get("/mine", requireAuth, getMyConversations);
router.get("/:id/messages", requireAuth, getConversationMessages);
router.post("/:id/messages", requireAuth, sendMessage);
router.post("/:id/offer", requireAuth, sendOffer);
router.post("/:id/offer/respond", requireAuth, respondToOffer);

export default router;