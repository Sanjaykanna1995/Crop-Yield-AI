"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class AnalyticsService {
    static async getUserAnalytics(userId) {
        const userPredictions = await db_1.db
            .select()
            .from(schema_1.predictions)
            .where((0, drizzle_orm_1.eq)(schema_1.predictions.user_id, userId));
        /* =====================================
           BASIC METRICS
        ===================================== */
        const totalPredictions = userPredictions.length;
        const completed = userPredictions.filter((p) => p.actual_yield !== null).length;
        const pending = totalPredictions - completed;
        const avgPredictedYield = totalPredictions > 0
            ? userPredictions.reduce((sum, p) => sum + Number(p.predicted_yield), 0) / totalPredictions
            : 0;
        const completedPredictions = userPredictions.filter((p) => p.actual_yield !== null);
        const avgActualYield = completedPredictions.length > 0
            ? completedPredictions.reduce((sum, p) => sum + Number(p.actual_yield), 0) / completedPredictions.length
            : 0;
        const accuracyPercentage = avgPredictedYield > 0
            ? (avgActualYield / avgPredictedYield) * 100
            : 0;
        const completionRate = totalPredictions > 0
            ? (completed / totalPredictions) * 100
            : 0;
        const variance = avgPredictedYield - avgActualYield;
        const kpis = {
            totalPredictions,
            completed,
            pending,
            avgPredictedYield: Number(avgPredictedYield.toFixed(2)),
            avgActualYield: Number(avgActualYield.toFixed(2)),
            accuracyPercentage: Number(accuracyPercentage.toFixed(2)),
            completionRate: Number(completionRate.toFixed(2)),
            variance: Number(variance.toFixed(2)),
        };
        const yieldComparison = {
            predictedAvg: kpis.avgPredictedYield,
            actualAvg: kpis.avgActualYield,
        };
        /* =====================================
           MONTHLY TREND
        ===================================== */
        const monthlyMap = {};
        userPredictions.forEach((p) => {
            if (!p.created_at)
                return;
            const date = new Date(p.created_at);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = { predictions: 0, totalYield: 0 };
            }
            monthlyMap[key].predictions += 1;
            monthlyMap[key].totalYield += Number(p.predicted_yield);
        });
        const monthlyTrend = Object.entries(monthlyMap)
            .map(([key, value]) => {
            const [year, month] = key.split("-");
            const monthName = new Date(Number(year), Number(month)).toLocaleString("default", { month: "short" });
            return {
                month: `${monthName} ${year}`,
                predictions: value.predictions,
                avgYield: Number((value.totalYield / value.predictions).toFixed(2)),
            };
        })
            .sort((a, b) => new Date(a.month).getTime() -
            new Date(b.month).getTime());
        const bestMonth = monthlyTrend.length > 0
            ? monthlyTrend.reduce((prev, current) => current.avgYield > prev.avgYield
                ? current
                : prev).month
            : "N/A";
        /* =====================================
           CROP DISTRIBUTION
        ===================================== */
        const cropMap = {};
        userPredictions.forEach((p) => {
            cropMap[p.crop_type] =
                (cropMap[p.crop_type] || 0) + 1;
        });
        const cropDistribution = Object.entries(cropMap).map(([crop, count]) => ({
            crop,
            count,
        }));
        /* =====================================
           SOIL PERFORMANCE
        ===================================== */
        const soilMap = {};
        userPredictions.forEach((p) => {
            if (!soilMap[p.soil_type]) {
                soilMap[p.soil_type] = {
                    totalYield: 0,
                    count: 0,
                };
            }
            soilMap[p.soil_type].totalYield += Number(p.predicted_yield);
            soilMap[p.soil_type].count += 1;
        });
        const soilPerformance = Object.entries(soilMap).map(([soil, value]) => ({
            soil,
            avgYield: Number((value.totalYield / value.count).toFixed(2)),
        }));
        /* =====================================
           TEMPERATURE ANALYSIS
        ===================================== */
        const temperatureAnalysis = userPredictions.map((p) => ({
            temperature: Number(p.temperature),
            predicted: Number(p.predicted_yield),
            actual: p.actual_yield !== null
                ? Number(p.actual_yield)
                : null,
        }));
        /* =====================================
           HUMIDITY ANALYSIS
        ===================================== */
        const humidityAnalysis = userPredictions.map((p) => ({
            humidity: Number(p.humidity),
            predicted: Number(p.predicted_yield),
            actual: p.actual_yield !== null
                ? Number(p.actual_yield)
                : null,
        }));
        /* =====================================
           FINAL RESPONSE
        ===================================== */
        return {
            kpis,
            yieldComparison,
            monthlyTrend,
            cropDistribution,
            soilPerformance,
            temperatureAnalysis,
            humidityAnalysis,
            bestMonth,
        };
    }
}
exports.AnalyticsService = AnalyticsService;
