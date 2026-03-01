import { db } from "../config/db";
import { predictions, users } from "../db/schema";

export class AdminAnalyticsService {
  static async getSystemOverview() {
    const allUsers = await db.select().from(users);
    const allPredictions = await db.select().from(predictions);

    const totalUsers = allUsers.length;
    const totalPredictions = allPredictions.length;

    const completed = allPredictions.filter(
      (p) => p.actual_yield !== null
    ).length;

    const pending = totalPredictions - completed;

    return {
      totalUsers,
      totalPredictions,
      completed,
      pending,
    };
  }

 static async getSystemAnalytics() {
  const allPredictions = await db.select().from(predictions);
  const allUsers = await db.select().from(users);

  const totalUsers = allUsers.length;
  const totalPredictions = allPredictions.length;

  const completed = allPredictions.filter(
    (p) => p.actual_yield !== null
  ).length;

  const pending = totalPredictions - completed;

  const avgPredicted =
    totalPredictions > 0
      ? allPredictions.reduce(
          (sum, p) => sum + Number(p.predicted_yield ?? 0),
          0
        ) / totalPredictions
      : 0;

  const completedPredictions = allPredictions.filter(
    (p) => p.actual_yield !== null
  );

  const avgActual =
    completedPredictions.length > 0
      ? completedPredictions.reduce(
          (sum, p) => sum + Number(p.actual_yield ?? 0),
          0
        ) / completedPredictions.length
      : 0;

  const accuracy =
    avgActual > 0
      ? 100 -
        (Math.abs(avgPredicted - avgActual) / avgActual) * 100
      : 0;

  /* Crop Distribution (Safe) */
  const cropMap: Record<string, number> = {};
  allPredictions.forEach((p) => {
    if (!p.crop_type) return;
    cropMap[p.crop_type] =
      (cropMap[p.crop_type] || 0) + 1;
  });

  const cropDistribution = Object.entries(cropMap).map(
    ([crop, count]) => ({ crop, count })
  );

  /* Soil Performance (Safe) */
  const soilMap: Record<
    string,
    { total: number; count: number }
  > = {};

  allPredictions.forEach((p) => {
    if (!p.soil_type) return;

    if (!soilMap[p.soil_type]) {
      soilMap[p.soil_type] = { total: 0, count: 0 };
    }

    soilMap[p.soil_type].total += Number(
      p.predicted_yield ?? 0
    );
    soilMap[p.soil_type].count++;
  });

  const soilPerformance = Object.entries(soilMap).map(
    ([soil, value]) => ({
      soil,
      avgYield:
        value.count > 0
          ? Number((value.total / value.count).toFixed(2))
          : 0,
    })
  );

  const temperatureAnalysis = allPredictions
    .filter((p) => p.temperature !== null)
    .map((p) => ({
      temperature: p.temperature,
      predicted: Number(p.predicted_yield ?? 0),
      actual:
        p.actual_yield !== null
          ? Number(p.actual_yield)
          : null,
    }));

  const humidityAnalysis = allPredictions
    .filter((p) => p.humidity !== null)
    .map((p) => ({
      humidity: p.humidity,
      predicted: Number(p.predicted_yield ?? 0),
      actual:
        p.actual_yield !== null
          ? Number(p.actual_yield)
          : null,
    }));
    /* ===============================
   MONTHLY TREND
=============================== */

const monthlyMap: Record<
  string,
  { predictions: number; totalYield: number }
> = {};

allPredictions.forEach((p) => {
  if (!p.created_at) return;

  const date = new Date(p.created_at);
  const key = `${date.getFullYear()}-${date.getMonth()}`;

  if (!monthlyMap[key]) {
    monthlyMap[key] = {
      predictions: 0,
      totalYield: 0,
    };
  }

  monthlyMap[key].predictions += 1;
  monthlyMap[key].totalYield += Number(
    p.predicted_yield ?? 0
  );
});

const monthlyTrend = Object.entries(monthlyMap)
  .map(([key, value]) => {
    const [year, month] = key.split("-");
    const monthName = new Date(
      Number(year),
      Number(month)
    ).toLocaleString("default", { month: "short" });

    return {
      month: `${monthName} ${year}`,
      predictions: value.predictions,
      avgYield:
        value.predictions > 0
          ? Number(
              (
                value.totalYield /
                value.predictions
              ).toFixed(2)
            )
          : 0,
    };
  })
  .sort(
    (a, b) =>
      new Date(a.month).getTime() -
      new Date(b.month).getTime()
  );

  return {
    totalUsers,
    totalPredictions,
    completed,
    pending,
    avgPredicted: Number(avgPredicted.toFixed(2)),
    avgActual: Number(avgActual.toFixed(2)),
    accuracy: Number(accuracy.toFixed(2)),
    monthlyTrend,
    cropDistribution,
    soilPerformance,
    temperatureAnalysis,
    humidityAnalysis,
  };
}
}