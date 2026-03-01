import { Router } from "express";
import { PredictionController } from "../controllers/prediction.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/* =========================
   GET ALL PREDICTIONS
========================= */
router.get(
  "/",
  authenticate,
  async (req, res) => PredictionController.getAllPredictions(req as any, res)
);

/* =========================
   CREATE NEW PREDICTION
========================= */
router.post(
  "/predict",
  authenticate,
  async (req, res) => PredictionController.predict(req as any, res)
);

/* =========================
   UPDATE ACTUAL YIELD
========================= */
router.patch(
  "/:id",
  authenticate,
  async (req, res) => PredictionController.updatePrediction(req as any, res)
);

export default router;