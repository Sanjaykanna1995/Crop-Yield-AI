// backend/src/dto/analytics.dto.ts

/* =====================================
   BASE KPI RESPONSE
===================================== */

export interface KPIResponse {
  totalPredictions: number;
  completed: number;
  pending: number;
  avgPredictedYield: number;
  avgActualYield: number;
}

/* =====================================
   EXTENDED KPI (Frontend + Admin)
===================================== */

export interface ExtendedKPIResponse extends KPIResponse {
  accuracyPercentage: number;
  completionRate: number;
  variance: number;
}

/* =====================================
   YIELD COMPARISON
===================================== */

export interface YieldComparisonResponse {
  predictedAvg: number;
  actualAvg: number;
}

/* =====================================
   MONTHLY TREND
===================================== */

export interface MonthlyTrendItem {
  month: string; // Format: "Jan 2026"
  predictions: number;
  avgYield: number;
}

/* =====================================
   CROP DISTRIBUTION
===================================== */

export interface CropDistributionItem {
  crop: string;
  count: number;
}

/* =====================================
   SOIL PERFORMANCE
===================================== */

export interface SoilPerformanceItem {
  soil: string;
  avgYield: number;
}

/* =====================================
   TEMPERATURE ANALYSIS
===================================== */

export interface TemperatureAnalysisItem {
  temperature: number;
  predicted: number;
  actual: number | null;
}

/* =====================================
   HUMIDITY ANALYSIS
===================================== */

export interface HumidityAnalysisItem {
  humidity: number;
  predicted: number;
  actual: number | null;
}

/* =====================================
   COMPLETE ANALYTICS RESPONSE
===================================== */

export interface ExtendedAnalyticsResponse {
  kpis: ExtendedKPIResponse;
  yieldComparison: YieldComparisonResponse;
  monthlyTrend: MonthlyTrendItem[];

  cropDistribution: CropDistributionItem[];
  soilPerformance: SoilPerformanceItem[];

  temperatureAnalysis: TemperatureAnalysisItem[];
  humidityAnalysis: HumidityAnalysisItem[];

  bestMonth: string;
}