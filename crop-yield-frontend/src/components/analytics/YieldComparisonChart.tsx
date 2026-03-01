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

interface YieldComparisonData {
  predictedAvg: number;
  actualAvg: number;
}

const YieldComparisonChart = ({ data }: { data: YieldComparisonData }) => {
  // 1. Premium Empty State Handling
  if (!data || (data.predictedAvg === 0 && data.actualAvg === 0)) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-75 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-gray-100">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Yield Data Yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
          Complete predictions with actual harvested yields to see how accurately the AI is performing.
        </p>
      </div>
    );
  }

  // 2. Injecting specific brand colors directly into the data payload
  const chartData = [
    { 
      name: "Predicted Average", 
      value: data.predictedAvg,
      fill: "#8b5cf6" // Soft purple to represent the AI/Prediction
    },
    { 
      name: "Actual Average", 
      value: data.actualAvg,
      fill: "#10b981" // Primary emerald brand color for Reality
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* --- Premium Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Scale className="w-5 h-5 text-emerald-600" />
            </div>
            Accuracy Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Comparing overall predicted yield vs. actual harvested yield.
          </p>
        </div>
      </div>

      {/* --- Chart Container --- */}
      <div className="h-75 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            
            {/* Subtle Grid Lines to anchor the eye */}
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
            
            {/* Clean X-Axis */}
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            
            {/* Clean Y-Axis with 't/ha' suffix */}
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} t/ha`}
            />
            
            {/* Custom Styled Tooltip */}
            <Tooltip
              cursor={{ fill: '#f9fafb' }} // Soft gray background on the hovered column
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                padding: '16px 20px',
              }}
              itemStyle={{ fontSize: '15px', fontWeight: 700, padding: '4px 0', color: '#111827' }}
              labelStyle={{ display: 'none' }} // Hide redundant label
              
              // Safe formatter to prevent TypeScript/Recharts undefined errors
              formatter={(value: number | undefined, name: string | undefined) => {
                const safeValue = value || 0;
                const safeName = name || '';
                return [`${safeValue.toFixed(2)} tons/hectare`, safeName];
              }}
            />
            
            {/* Data Bars */}
            <Bar 
              dataKey="value" 
              barSize={80} 
              radius={[8, 8, 0, 0]} // Rounds the top corners of the bars
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

export default YieldComparisonChart;