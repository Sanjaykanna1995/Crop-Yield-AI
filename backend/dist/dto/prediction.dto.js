"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionSchema = void 0;
const zod_1 = require("zod");
exports.predictionSchema = zod_1.z.object({
    location: zod_1.z.string().min(2, "Location is required"),
    soil_type: zod_1.z.string().min(2, "Soil type is required"),
    crop_type: zod_1.z.string().min(2, "Crop type is required"),
});
