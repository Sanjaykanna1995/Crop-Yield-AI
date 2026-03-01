import { spawn } from "child_process";
import path from "path";
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
  ): Promise<{ predicted_yield: number }> {

    return new Promise((resolve, reject) => {

      const pythonPath = path.join(
        __dirname,
        "../../server/ml/predict.py"
      );

      const pythonProcess = spawn("python", [pythonPath]);

      let result = "";
      let errorOutput = "";

      pythonProcess.stdin.write(JSON.stringify(input));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        if (code !== 0) {
          console.error("Python Error:", errorOutput);
          return reject(new Error("ML prediction failed"));
        }

        try {
          const parsed = JSON.parse(result);
          const predictedYield = parsed.predicted_yield;

          await db.insert(predictions).values({
            user_id: userId,
            temperature: input.temperature,
            rainfall: input.rainfall,
            humidity: input.humidity,
            soil_type: input.soil_type,
            crop_type: input.crop_type,
            predicted_yield: predictedYield,
          });

          resolve({
            predicted_yield: Number(predictedYield),
          });

        } catch (err) {
          console.error("Parse Error:", err);
          reject(new Error("Invalid ML response"));
        }
      });
    });
  }
}