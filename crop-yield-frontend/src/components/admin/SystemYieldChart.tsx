import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { Scale, BarChart3 } from "lucide-react";
import type { SystemAnalyticsResponse } from "../../types/admin.types";

interface Props {
  data: SystemAnalyticsResponse;
}

const SystemYieldChart = ({ data }: Props) => {
  // 1. Premium Empty State Handling
  const hasData = data && (data.avgPredicted > 0 || data.avgActual > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-gray-100">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Yield Data Yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
          System analytics will populate once users start submitting actual harvest results.
        </p>
      </div>
    );
  }

  // 2. Map SystemAnalyticsResponse to Recharts format
  const chartData = [
    { 
      name: "Average Predicted", 
      value: data.avgPredicted,
      fill: "#8b5cf6" // Soft purple for AI
    },
    { 
      name: "Average Actual", 
      value: data.avgActual,
      fill: "#10b981" // Emerald for Reality
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Scale className="w-5 h-5 text-emerald-600" />
            </div>
            Predicted vs Actual Yield
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Comparing system-wide predicted averages against real-world harvest data.
          </p>
        </div>
      </div>

      {/* --- Chart Container --- */}
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            
            <Tooltip
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '16px 20px',
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}
              labelStyle={{ display: 'none' }}
              // FIXED: Added undefined check and safe name handling for TypeScript
              formatter={(value: number | undefined, name: string | undefined) => {
                const safeValue = value ?? 0;
                return [`${safeValue.toFixed(2)} units`, name ?? "Value"];
              }}
            />
            
            <Bar 
              dataKey="value" 
              barSize={60} 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemYieldChart;