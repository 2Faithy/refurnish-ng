import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  getMyPayouts,
  reportPayoutIssue,
  getAllPayouts,
  requestBankDetails,
  markPayoutPaid,
} from "../controllers/payouts.controller";

const router = Router();

router.get("/mine", requireAuth, getMyPayouts);
router.post("/:id/report", requireAuth, reportPayoutIssue);

router.get("/admin/all", requireAdmin, getAllPayouts);
router.post("/admin/:id/request-bank-details", requireAdmin, requestBankDetails);
router.post("/admin/:id/mark-paid", requireAdmin, markPayoutPaid);

export default router;