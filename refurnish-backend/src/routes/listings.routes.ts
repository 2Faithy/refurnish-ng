import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createListing,
  getMyListings,
  getListingById,
  resubmitListing,
  getAllListings,
  reviewListing,
  deleteListing,
} from "../controllers/listings.controller";

const router = Router();

router.post("/", requireAuth, createListing);
router.get("/mine", requireAuth, getMyListings);
router.get("/:id", requireAuth, getListingById);
router.patch("/:id", requireAuth, resubmitListing);

// TODO: these are admin-only actions — add real admin auth before going live.
// For now they're open so your admin panel can call them directly.
router.get("/admin/all", getAllListings);
router.post("/:id/review", reviewListing);
router.delete("/:id", deleteListing);

export default router;