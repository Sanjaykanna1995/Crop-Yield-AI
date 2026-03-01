// src/types/prediction.types.ts

export type PredictionStatus = "PENDING" | "COMPLETED";

export interface Prediction {
  id: string;
  location: string;
  cropType: string;
  predictedYield: number;
  actualYield: number | null;
  status: PredictionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePredictionPayload {
  actualYield: number;
}