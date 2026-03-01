import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// 🔐 Register
router.post("/register", AuthController.register);

// 🔑 Login
router.post("/login", AuthController.login);

// 👤 Get Current Logged-in User
router.get("/me", authenticate, (req, res) => {
  res.json({
    user: (req as any).user,
  });
});

export default router;