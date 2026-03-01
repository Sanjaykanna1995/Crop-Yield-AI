import { Request, Response } from "express";
import { db } from "../config/db";
import { predictions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { PredictionService } from "../services/prediction.service";
import { WeatherService } from "../services/weather.service";
import { predictionSchema } from "../dto/prediction.dto";

export class PredictionController {

  /* =========================
     GET ALL PREDICTIONS
  ========================= */
  static async getAllPredictions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;

      const userPredictions = await db
        .select()
        .from(predictions)
        .where(eq(predictions.user_id, userId));

      return res.status(200).json(userPredictions);

    } catch (error: any) {
      console.error("Get Predictions Error:", error);
      return res.status(500).json({
        message: error.message || "Failed to fetch predictions",
      });
    }
  }

  /* =========================
     CREATE PREDICTION
  ========================= */
  static async predict(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;

      const parsed = predictionSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: parsed.error.issues[0]?.message || "Invalid input",
        });
      }

      const { location, soil_type, crop_type } = parsed.data;

      // 🌦 Fetch Weather
      const weather = await WeatherService.getWeatherByCity(location);

      const predictionInput = {
        temperature: weather.temperature,
        rainfall: weather.rainfall,
        humidity: weather.humidity,
        soil_type,
        crop_type,
      };

      // 🤖 Run ML + Save
      const savedPrediction = await PredictionService.predictAndSave(
        userId,
        predictionInput
      );

      return res.status(201).json({
        weather,
        predictedYield: Number(savedPrediction.predicted_yield),
      });

    } catch (error: any) {
      console.error("Prediction Error:", error);

      return res.status(500).json({
        message: error.message || "Prediction failed",
      });
    }
  }

  /* =========================
     UPDATE ACTUAL YIELD
  ========================= */
  static async updatePrediction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const predictionId = String(req.params.id);
      const { actual_yield } = req.body;

      if (!actual_yield || Number(actual_yield) <= 0) {
        return res.status(400).json({
          message: "Invalid actual yield",
        });
      }

      const updated = await db
        .update(predictions)
        .set({
          actual_yield: Number(actual_yield),
        })
        .where(
          and(
            eq(predictions.id, predictionId),
            eq(predictions.user_id, userId)
          )
        )
        .returning();

      if (!updated.length) {
        return res.status(404).json({
          message: "Prediction not found or unauthorized",
        });
      }

      return res.status(200).json(updated[0]);

    } catch (error: any) {
      console.error("Update Prediction Error:", error);

      return res.status(500).json({
        message: error.message || "Failed to update prediction",
      });
    }
  }
}