"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionService = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
class PredictionService {
    static async predictAndSave(userId, input) {
        try {
            // 🔥 Call Python ML API
            const response = await axios_1.default.post("http://127.0.0.1:8000/predict", input, {
                timeout: 30000,
            });
            const predictedYield = response.data.predicted_yield;
            if (!predictedYield) {
                throw new Error("Invalid prediction response from ML service");
            }
            // 💾 Insert only columns that EXIST in schema
            const saved = await db_1.db
                .insert(schema_1.predictions)
                .values({
                user_id: userId,
                temperature: input.temperature,
                rainfall: input.rainfall,
                humidity: input.humidity,
                soil_type: input.soil_type,
                crop_type: input.crop_type,
                predicted_yield: predictedYield,
            })
                .returning();
            return saved[0];
        }
        catch (error) {
            console.error("Prediction Service Error:", error.response?.data || error.message);
            throw new Error("ML prediction failed");
        }
    }
}
exports.PredictionService = PredictionService;
