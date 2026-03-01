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
    static async predictAndSave(userId, input) {
        return new Promise((resolve, reject) => {
            const pythonPath = path_1.default.join(__dirname, "../../server/ml/predict.py");
            const pythonProcess = (0, child_process_1.spawn)("python", [pythonPath]);
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
                    await db_1.db.insert(schema_1.predictions).values({
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
                }
                catch (err) {
                    console.error("Parse Error:", err);
                    reject(new Error("Invalid ML response"));
                }
            });
        });
    }
}
exports.PredictionService = PredictionService;
