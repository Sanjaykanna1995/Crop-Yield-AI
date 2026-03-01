"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionController = void 0;
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const prediction_service_1 = require("../services/prediction.service");
const weather_service_1 = require("../services/weather.service");
const prediction_dto_1 = require("../dto/prediction.dto");
class PredictionController {
    /* =========================
       GET ALL PREDICTIONS
    ========================= */
    static async getAllPredictions(req, res) {
        try {
            const userId = req.user.id;
            const userPredictions = await db_1.db
                .select()
                .from(schema_1.predictions)
                .where((0, drizzle_orm_1.eq)(schema_1.predictions.user_id, userId));
            return res.status(200).json(userPredictions);
        }
        catch (error) {
            console.error("Get Predictions Error:", error);
            return res.status(500).json({
                message: error.message || "Failed to fetch predictions",
            });
        }
    }
    /* =========================
       CREATE PREDICTION
    ========================= */
    static async predict(req, res) {
        try {
            const userId = req.user.id;
            const parsed = prediction_dto_1.predictionSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    message: parsed.error.issues[0]?.message || "Invalid input",
                });
            }
            const { location, soil_type, crop_type } = parsed.data;
            const weather = await weather_service_1.WeatherService.getWeatherByCity(location);
            const predictionInput = {
                temperature: weather.temperature,
                rainfall: weather.rainfall,
                humidity: weather.humidity,
                soil_type,
                crop_type,
                fertilizer: "NPK",
                area: 1,
            };
            const savedPrediction = await prediction_service_1.PredictionService.predictAndSave(userId, predictionInput);
            return res.status(201).json({
                weather,
                predictedYield: Number(savedPrediction.predicted_yield),
            });
        }
        catch (error) {
            console.error("Prediction Error:", error);
            return res.status(500).json({
                message: error.message || "Prediction failed",
            });
        }
    }
    /* =========================
       UPDATE ACTUAL YIELD
    ========================= */
    static async updatePrediction(req, res) {
        try {
            const userId = req.user.userId || req.user.id;
            const predictionId = String(req.params.id);
            const { actual_yield } = req.body;
            if (!actual_yield || Number(actual_yield) <= 0) {
                return res.status(400).json({
                    message: "Invalid actual yield",
                });
            }
            const updated = await db_1.db
                .update(schema_1.predictions)
                .set({
                actual_yield: Number(actual_yield),
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.predictions.id, predictionId), (0, drizzle_orm_1.eq)(schema_1.predictions.user_id, userId)))
                .returning();
            if (!updated.length) {
                return res.status(404).json({
                    message: "Prediction not found or unauthorized",
                });
            }
            return res.status(200).json(updated[0]);
        }
        catch (error) {
            console.error("Update Prediction Error:", error);
            return res.status(500).json({
                message: error.message || "Failed to update prediction",
            });
        }
    }
}
exports.PredictionController = PredictionController;
