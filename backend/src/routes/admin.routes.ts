import { Router } from "express";
import {
  getSystemOverview,
  getSystemAnalytics,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllPredictions,
  deletePrediction,
} from "../controllers/admin.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/overview", getSystemOverview);
router.get("/analytics", getSystemAnalytics);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

router.get("/predictions", getAllPredictions);
router.delete("/predictions/:id", deletePrediction);

export default router;