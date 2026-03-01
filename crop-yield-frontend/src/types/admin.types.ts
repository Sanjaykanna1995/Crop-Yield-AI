export interface SystemAnalyticsResponse {
  totalUsers: number;
  totalPredictions: number;
  completed: number;
  pending: number;
  avgPredicted: number;
  avgActual: number;
  accuracy: number;

  monthlyTrend: {
    month: string;
    predictions: number;
    avgYield: number;
  }[];

  cropDistribution: {
    crop: string;
    count: number;
  }[];

  soilPerformance: {
    soil: string;
    avgYield: number;
  }[];

  temperatureAnalysis: {
    temperature: number;
    predicted: number;
    actual: number | null;
  }[];

  humidityAnalysis: {
    humidity: number;
    predicted: number;
    actual: number | null;
  }[];
}