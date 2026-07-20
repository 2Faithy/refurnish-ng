import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  createListing,
  getMyListings,
  getListingById,
  resubmitListing,
  getActiveListings,
  getActiveListingById,
  getAllListings,
  reviewListing,
  deleteListing,
} from "../controllers/listings.controller";

const router = Router();

router.get("/", getActiveListings);
router.post("/", requireAuth, createListing);
router.get("/mine", requireAuth, getMyListings);
router.get("/public/:id", getActiveListingById);
router.get("/:id", requireAuth, getListingById);
router.patch("/:id", requireAuth, resubmitListing);

router.get("/admin/all", requireAdmin, getAllListings);
router.post("/:id/review", requireAdmin, reviewListing);
router.delete("/:id", requireAdmin, deleteListing);

export default router;