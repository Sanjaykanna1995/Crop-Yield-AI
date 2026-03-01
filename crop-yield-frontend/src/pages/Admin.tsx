import { useEffect, useState } from "react";
import { getSystemAnalytics } from "../api/admin.api";
import type { SystemAnalyticsResponse } from "../types/admin.types";

import SystemKPISection from "../components/admin/SystemKPISection";
import SystemYieldChart from "../components/admin/SystemYieldChart";
import SystemTrendChart from "../components/admin/SystemTrendChart";
import UserManagementTable from "../components/admin/UserManagementTable";
import PredictionManagementTable from "../components/admin/PredictionManagementTable";
import CropDistributionChart from "../components/admin/CropDistributionChart";
import SoilPerformanceChart from "../components/admin/SoilPerformanceChart";
import TemperatureAnalysisChart from "../components/admin/TemperatureAnalysisChart";
import HumidityAnalysisChart from "../components/admin/HumidityAnalysisChart";

const Admin = () => {
  const [data, setData] =
    useState<SystemAnalyticsResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getSystemAnalytics();
        setData(result);
      } catch (error) {
        console.error("Failed to load admin data", error);
      }
    };

    load();
  }, []);

  if (!data) {
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">

      {/* ================= KPI SECTION ================= */}
      <SystemKPISection data={data} />

      {/* ================= Yield + Trend ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SystemYieldChart data={data} />
        <SystemTrendChart data={data.monthlyTrend} />
      </div>

      {/* ================= Crop + Soil ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CropDistributionChart data={data} />
        <SoilPerformanceChart data={data} />
      </div>

      {/* ================= Temperature + Humidity ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TemperatureAnalysisChart data={data} />
        <HumidityAnalysisChart data={data} />
      </div>

      {/* ================= Tables ================= */}
      <UserManagementTable />
      <PredictionManagementTable />

    </div>
  );
};

export default Admin;