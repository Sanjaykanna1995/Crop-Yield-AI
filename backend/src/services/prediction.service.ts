import axios from "axios";
import { db } from "../config/db";
import { predictions } from "../db/schema";

interface PredictionInput {
  temperature: number;
  rainfall: number;
  humidity: number;
  soil_type: string;
  crop_type: string;
}

export class PredictionService {

  static async predictAndSave(
    userId: string,
    input: PredictionInput
  ) {
    try {

      // 🔥 Call Python ML API
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        input,
        {
          timeout: 30000,
        }
      );

      const predictedYield = response.data.predicted_yield;

      if (!predictedYield) {
        throw new Error("Invalid prediction response from ML service");
      }

      // 💾 Insert only columns that EXIST in schema
      const saved = await db
        .insert(predictions)
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

    } catch (error: any) {
      console.error(
        "Prediction Service Error:",
        error.response?.data || error.message
      );
      throw new Error("ML prediction failed");
    }
  }
}