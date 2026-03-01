import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { 
  NameType, 
  ValueType 
} from "recharts/types/component/DefaultTooltipContent";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import type { SystemAnalyticsResponse } from "../../types/admin.types";

interface Props {
  data: SystemAnalyticsResponse;
}

/**
 * Custom Tooltip with glassmorphism and high-contrast typography
 */
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType> & { payload?: Payload<ValueType, NameType>[] }) => {
  if (active && payload && payload.length) {
    const tempLabel = payload[0]?.payload?.temperature;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-2">
          Temp: {tempLabel}°C
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-8 mb-2 last:mb-0">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              {entry.name}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {entry.value !== null ? Number(entry.value).toLocaleString() : "Pending"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TemperatureYieldChart = ({ data }: Props) => {
  const chartData = data.temperatureAnalysis;

  return (
    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Temperature vs Yield
          </h3>
          <p className="text-sm text-slate-500 mt-1">Predictive analysis of environmental output</p>
        </div>
        
        {/* Floating Legend Badges */}
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Actual</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Predicted</span>
           </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="8 8" 
              stroke="#f1f5f9" 
            />

            <XAxis
              dataKey="temperature"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={15}
              unit="°C"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '6 6' }} 
            />

            {/* Predicted Line (Emerald) */}
            <Line
              name="Predicted"
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#10b981' }}
              animationDuration={2000}
            />

            {/* Actual Line (Indigo) */}
            <Line
              name="Actual"
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
              strokeWidth={4}
              dot={false}
              connectNulls // Keeps the line continuous even if some points are missing actual data
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#6366f1' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureYieldChart;