import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/adminAuth.middleware";
import {
  getMe,
  updateProfile,
  uploadIdDocument,
  updateNotificationPreferences,
  updateBankDetails,
  updatePreferences,
  deactivateAccount,
  deleteAccount,
  changePassword,
  getPendingIdVerifications,
  reviewIdVerification,
} from "../controllers/users.controller";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateProfile);
router.patch("/me/bank-details", requireAuth, updateBankDetails);
router.patch("/me/preferences", requireAuth, updatePreferences);
router.post("/me/deactivate", requireAuth, deactivateAccount);
router.delete("/me", requireAuth, deleteAccount);
router.post("/me/id-document", requireAuth, uploadIdDocument);
router.patch("/me/notifications", requireAuth, updateNotificationPreferences);
router.post("/me/change-password", requireAuth, changePassword);

router.get("/admin/id-verifications", requireAdmin, getPendingIdVerifications);
router.post("/admin/id-verifications/:id/review", requireAdmin, reviewIdVerification);

export default router;