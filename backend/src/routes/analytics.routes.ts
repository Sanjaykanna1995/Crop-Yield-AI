import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/analytics
 * @desc    Get analytics for authenticated user
 * @access  USER + ADMIN
 */
router.get("/", authenticate, getAnalytics);

export default router;