import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  createListing,
  getMyListings,
  getListingById,
  resubmitListing,
  markListingSold,
  deleteMyListing,
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
router.post("/:id/sold", requireAuth, markListingSold);
router.delete("/mine/:id", requireAuth, deleteMyListing);

router.get("/admin/all", requireAdmin, getAllListings);
router.post("/:id/review", requireAdmin, reviewListing);
router.delete("/:id", requireAdmin, deleteListing);

export default router;