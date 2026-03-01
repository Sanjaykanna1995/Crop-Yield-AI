import { spawn } from "child_process";
import path from "path";
import { db } from "../config/db";
import { predictions } from "../db/schema";

export interface PredictionInput {
  temperature: number;
  rainfall: number;
  humidity: number;
  soil_type: string;
  crop_type: string;
  fertilizer: string;
  area: number;
}

export class PredictionService {

  static predictAndSave(
  userId: string,
  data: PredictionInput
): Promise<any> {

  return new Promise((resolve, reject) => {

    const scriptPath = path.join(
      __dirname,
      "../../../server/ml/predict.py"
    );

    const pythonProcess = spawn("python", [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let result = "";
    let errorOutput = "";

    const timeout = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("ML prediction timeout"));
    }, 10000); // 10 seconds max

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (chunk) => {
      result += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });

    pythonProcess.on("close", async (code) => {

      clearTimeout(timeout);

      if (code !== 0) {
        console.error("Python Error:", errorOutput);
        return reject(new Error("ML prediction failed"));
      }

      try {
        const parsed = JSON.parse(result);

        if (!parsed.predicted_yield) {
          throw new Error("Invalid ML response");
        }

        const inserted = await db
          .insert(predictions)
          .values({
            user_id: userId,
            temperature: data.temperature,
            rainfall: data.rainfall,
            humidity: data.humidity,
            soil_type: data.soil_type,
            crop_type: data.crop_type,
            predicted_yield: parsed.predicted_yield,
          })
          .returning();

        resolve(inserted[0]);

      } catch (err) {
        reject(new Error("Failed to process prediction result"));
      }
    });
  });
}
}