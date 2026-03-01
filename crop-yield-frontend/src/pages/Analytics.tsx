import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { Loader2, AlertCircle, RefreshCw, BarChart2, Calendar, Droplets, ThermometerSun, PieChart } from "lucide-react";

import type { AnalyticsResponse, KPIData } from "../types/analytics.types";

import KPISection from "../components/analytics/KPISection";
import YieldComparisonChart from "../components/analytics/YieldComparisonChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import CropDistributionChart from "../components/analytics/CropDistributionChart";
import SoilPerformanceChart from "../components/analytics/SoilPerformanceChart";
import TemperatureYieldChart from "../components/analytics/TemperatureYieldChart";
import HumidityYieldChart from "../components/analytics/HumidityYieldChart";

const Analytics = () => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get<AnalyticsResponse>("/api/analytics");
      setData(response.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("We encountered an issue while fetching your analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl border border-emerald-50">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Compiling Analytics</h3>
          <p className="text-gray-500 font-medium mt-1">Synchronizing your harvest insights...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-10 rounded-[2.5rem] border border-red-100 text-center max-w-md shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Lost</h3>
          <button onClick={fetchAnalytics} className="mt-4 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { totalPredictions, completed, avgPredictedYield, avgActualYield } = data.kpis;
  const accuracyPercentage = avgPredictedYield > 0 ? (avgActualYield / avgPredictedYield) * 100 : 0;
  const extendedKpis: KPIData = {
    ...data.kpis,
    accuracyPercentage: Number(accuracyPercentage.toFixed(2)),
    completionRate: Number(((completed / totalPredictions) * 100).toFixed(2)),
    variance: Number((avgPredictedYield - avgActualYield).toFixed(2)),
  };

  const bestMonth = data.monthlyTrend?.length > 0 
    ? data.monthlyTrend.reduce((p, c) => c.avgYield > p.avgYield ? c : p).month 
    : "N/A";

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-16 px-4 sm:px-6 animate-in fade-in duration-1000">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart2 className="w-10 h-10 text-emerald-600" />
            Analytics Center
          </h2>
          <p className="text-gray-500 font-medium mt-2">
            Real-time crop intelligence and yield forecasting
          </p>
        </div>
        
        <button onClick={fetchAnalytics} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* 2. KPI GRID (FULL WIDTH) */}
      <KPISection kpis={extendedKpis} />

      {/* 3. PRIMARY DATA ROW (Yield & Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <YieldComparisonChart data={data.yieldComparison} />
        <MonthlyTrendChart data={data.monthlyTrend} />
      </div>

      {/* 4. ENVIRONMENTAL FACTORS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-2">
           <div className="flex items-center gap-2 px-8 pt-6">
              <ThermometerSun className="w-5 h-5 text-orange-500" />
              <h4 className="font-bold text-gray-900 italic">Thermal Variance Analysis</h4>
           </div>
           <TemperatureYieldChart data={data.temperatureAnalysis} />
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-2">
           <div className="flex items-center gap-2 px-8 pt-6">
              <Droplets className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-gray-900 italic">Moisture Impact Analysis</h4>
           </div>
           <HumidityYieldChart data={data.humidityAnalysis} />
        </div>
      </div>

      {/* 5. DISTRIBUTION & HIGHLIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* We combine the Best Month and Crop Distribution for a full-height card look */}
        <div className="flex flex-col gap-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl min-h-[220px] flex flex-col justify-center">
                <Calendar className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 -rotate-12 text-emerald-400" />
                <div className="relative z-10">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3">Seasonal Peak Performance</p>
                    <h4 className="text-5xl font-black mb-2 tracking-tighter uppercase">{bestMonth}</h4>
                    <p className="text-slate-400 text-lg max-w-md font-medium">
                        Identified as the optimal harvest window based on historical prediction accuracy.
                    </p>
                </div>
            </div>
            <SoilPerformanceChart data={data.soilPerformance} />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-8 pt-8 mb-2">
                <PieChart className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-gray-900">Crop Allocation Breakdown</h4>
            </div>
            <div className="flex-grow">
                <CropDistributionChart data={data.cropDistribution} />
            </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;