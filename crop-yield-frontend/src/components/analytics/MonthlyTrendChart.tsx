import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { MonthlyTrendItem } from "../../types/analytics.types";

interface Props {
  data: MonthlyTrendItem[];
}

const MonthlyTrendChart = ({ data }: Props) => {
  // --- Premium Empty State ---
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-96 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Trend Data</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
          Not enough data to generate a monthly trend. Start making predictions to see your analytics grow over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* --- Premium Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            Monthly Activity & Yield Trend
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Comparing prediction volume against average predicted yields over time.
          </p>
        </div>
        
        {/* Optional decorative badge to emphasize the dual-axis nature */}
        <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Volume
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Yield
          </div>
        </div>
      </div>

      {/* --- Chart Container --- */}
      <div className="h-80 sm:h-96 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            
            {/* SVG Gradients for the Area fills */}
            <defs>
              <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Very faint background grid for readability */}
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
            
            {/* Clean X-Axis */}
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            
            {/* Left Y-Axis for Volume (Predictions) */}
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />

            {/* Right Y-Axis for Yield (t/ha) */}
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} t/ha`}
            />

            {/* Custom Styled Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                padding: '16px 20px',
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 700, padding: '6px 0' }}
              labelStyle={{ color: '#6b7280', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}
              formatter={(value: number | undefined, name: string | undefined) => {
                const safeValue = value || 0;
                if (name === "predictions") return [safeValue, "Total Predictions"];
                if (name === "avgYield") return [`${safeValue.toFixed(2)} t/ha`, "Average Yield"];
                return [safeValue, name || ""];
              }}
            />

            {/* Modern Legend */}
            <Legend 
              verticalAlign="top" 
              height={40}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', paddingBottom: '10px' }}
              formatter={(value) => {
                if (value === "predictions") return "Total Predictions";
                if (value === "avgYield") return "Average Yield";
                return value;
              }}
            />

            {/* Line 1: Predictions (Indigo) */}
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="predictions" 
              stroke="#6366f1" 
              fill="url(#colorPredictions)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#6366f1' }}
              animationDuration={1500}
            />

            {/* Line 2: Avg Yield (Emerald Green) */}
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="avgYield" 
              stroke="#10b981" 
              fill="url(#colorYield)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#10b981' }}
              animationDuration={1500}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;