import API from "./axios";
import type { AnalyticsResponse } from "../types/analytics.types";

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const res = await API.get("/api/analytics");
  return res.data;
};