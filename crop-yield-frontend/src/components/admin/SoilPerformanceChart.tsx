
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Sprout } from "lucide-react";
import type { SystemAnalyticsResponse } from "../../types/admin.types";

interface Props {
  data: SystemAnalyticsResponse;
}

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#F97316"];

const SoilPerformanceChart = ({ data }: Props) => {
  const chartData = data.soilPerformance;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Sprout className="w-5 h-5 text-emerald-600" />
            </div>
            Soil Performance
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Average crop yield (t/ha) categorized by soil type
          </p>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#F3F4F6" 
            />
            
            <XAxis 
              dataKey="soil" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />
            
            <Tooltip
              cursor={{ fill: "#F9FAF7", radius: 8 }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                borderRadius: "16px",
                border: "1px solid #F3F4F6",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
              }}
              itemStyle={{ color: "#111827", fontWeight: 700, fontSize: "14px" }}
              labelStyle={{ color: "#6B7280", fontWeight: 600, marginBottom: "4px" }}
              // TypeScript safe formatter
              formatter={(value: number | undefined) => {
                const safeValue = value ?? 0;
                return [`${safeValue.toFixed(2)} t/ha`, "Avg Yield"];
              }}
            />
            
            <Bar 
              dataKey="avgYield" 
              radius={[8, 8, 0, 0]} 
              maxBarSize={50}
              animationDuration={1200}
              animationBegin={300}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoilPerformanceChart;