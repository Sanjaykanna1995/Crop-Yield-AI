"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prediction_controller_1 = require("../controllers/prediction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/* =========================
   GET ALL PREDICTIONS
========================= */
router.get("/", auth_middleware_1.authenticate, async (req, res) => prediction_controller_1.PredictionController.getAllPredictions(req, res));
/* =========================
   CREATE NEW PREDICTION
========================= */
router.post("/predict", auth_middleware_1.authenticate, async (req, res) => prediction_controller_1.PredictionController.predict(req, res));
/* =========================
   UPDATE ACTUAL YIELD
========================= */
router.patch("/:id", auth_middleware_1.authenticate, async (req, res) => prediction_controller_1.PredictionController.updatePrediction(req, res));
exports.default = router;
