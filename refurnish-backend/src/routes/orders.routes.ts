import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  createOrder,
  verifyPaystackOrder,
  getMyOrders,
  getAllOrders,
  reviewOrder,
  getSellerConfirmation,
  respondSellerConfirmation,
} from "../controllers/orders.controller";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, getMyOrders);
router.get("/verify/:reference", requireAuth, verifyPaystackOrder);

router.get("/seller/:token", getSellerConfirmation);
router.post("/seller/:token/respond", respondSellerConfirmation);

router.get("/admin/all", requireAdmin, getAllOrders);
router.post("/:id/review", requireAdmin, reviewOrder);

export default router;