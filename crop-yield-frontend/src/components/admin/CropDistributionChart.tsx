
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SystemAnalyticsResponse } from "../../types/admin.types";

interface Props {
  data: SystemAnalyticsResponse;
}

// An earthy, vibrant palette perfect for agricultural data
const COLORS = [
  "#10B981", // Emerald Green
  "#F59E0B", // Amber/Wheat
  "#8B5CF6", // Violet
  "#3B82F6", // Water Blue
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#D946EF", // Fuchsia
];

const CropDistributionChart = ({ data }: Props) => {
  // Calculate total for the center label
  const totalCrops = data.cropDistribution.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Crop Distribution
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Breakdown of current agricultural allocation across all users
        </p>
      </div>

      <div className="w-full h-[350px] relative">
        {/* Total Label in Center of Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-extrabold text-gray-900">
            {new Intl.NumberFormat().format(totalCrops)}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Items</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.cropDistribution}
              dataKey="count"
              nameKey="crop"
              cx="50%"
              cy="50%"
              innerRadius={80} 
              outerRadius={110}
              paddingAngle={5} 
              stroke="none"
              cornerRadius={8} 
              animationBegin={200}
              animationDuration={1200}
            >
              {data.cropDistribution.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                />
              ))}
            </Pie>
            
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
              }}
              itemStyle={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#111827',
              }}
              // FIXED: Added undefined check and typed the parameters correctly for Recharts
              formatter={(value: number | undefined, name: string | undefined) => {
                const safeValue = value ?? 0;
                return [`${safeValue} entries`, name ?? "Distribution"];
              }}
            />
            
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-gray-600 font-semibold px-2 capitalize">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CropDistributionChart;