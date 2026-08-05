import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { submitReport } from "../controllers/reports.controller";

const router = Router();

router.post("/", requireAuth, submitReport);

export default router;