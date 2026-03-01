"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
class PredictionService {
    static predictAndSave(userId, data) {
        return new Promise((resolve, reject) => {
            const scriptPath = path_1.default.join(__dirname, "../../../server/ml/predict.py");
            const pythonProcess = (0, child_process_1.spawn)("python", [scriptPath], {
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
                    const inserted = await db_1.db
                        .insert(schema_1.predictions)
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
                }
                catch (err) {
                    reject(new Error("Failed to process prediction result"));
                }
            });
        });
    }
}
exports.PredictionService = PredictionService;
