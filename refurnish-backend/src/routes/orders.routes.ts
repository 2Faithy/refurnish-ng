import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  createOrder,
  verifyPaystackOrder,
  getMyOrders,
  getMyOrderById,
  confirmOrderReceived,
  submitReview,
  fileDispute,
  getAllOrders,
  reviewOrder,
  getSellerConfirmation,
  respondSellerConfirmation,
  getAllDisputes,
  resolveDispute,
} from "../controllers/orders.controller";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, getMyOrders);
router.get("/verify/:reference", requireAuth, verifyPaystackOrder);

router.get("/seller/:token", getSellerConfirmation);
router.post("/seller/:token/respond", respondSellerConfirmation);

router.get("/admin/all", requireAdmin, getAllOrders);
router.post("/:id/review", requireAdmin, reviewOrder);

router.get("/disputes/admin/all", requireAdmin, getAllDisputes);
router.post("/disputes/:id/resolve", requireAdmin, resolveDispute);

router.get("/:id", requireAuth, getMyOrderById);
router.post("/:id/confirm-received", requireAuth, confirmOrderReceived);
router.post("/:id/submit-review", requireAuth, submitReview);
router.post("/:id/dispute", requireAuth, fileDispute);

export default router;