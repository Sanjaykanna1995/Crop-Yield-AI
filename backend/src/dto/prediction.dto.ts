import { z } from "zod";

export const predictionSchema = z.object({
  location: z.string().min(2, "Location is required"),
  soil_type: z.string().min(2, "Soil type is required"),
  crop_type: z.string().min(2, "Crop type is required"),
});

export type PredictionDTO = z.infer<typeof predictionSchema>;