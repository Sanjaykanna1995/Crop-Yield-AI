// backend/src/routes/user.routes.ts

import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET /api/users/me
router.get("/me", authenticate, UserController.getProfile);

// PUT /api/users/me
router.put("/me", authenticate, UserController.updateProfile);

// PUT /api/users/change-password
router.put(
  "/change-password",
  authenticate,
  UserController.changePassword
);

export default router;