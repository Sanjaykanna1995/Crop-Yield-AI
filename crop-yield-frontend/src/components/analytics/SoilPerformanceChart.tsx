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

interface SoilPerformanceData {
  soil: string;
  avgYield: number;
}

interface SoilPerformanceChartProps {
  data: SoilPerformanceData[];
}

// Optional: A palette if you want different colors per bar, 
// or you can just use one solid color for all.
const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#F97316"];

const SoilPerformanceChart = ({ data }: SoilPerformanceChartProps) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Soil Performance
        </h3>
        <p className="text-sm text-gray-500">
          Average crop yield by soil type
        </p>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Subtle horizontal grid lines */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#E5E7EB" 
            />
            
            {/* Cleaned up X-Axis */}
            <XAxis 
              dataKey="soil" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 13 }}
              dy={10} // Adds a bit of spacing between labels and the chart
            />
            
            {/* Cleaned up Y-Axis */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 13 }}
              dx={-10}
            />
            
            {/* Polished Tooltip */}
            <Tooltip
              cursor={{ fill: "#F3F4F6" }} // Subtle gray background on hover
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              itemStyle={{ color: "#111827", fontWeight: 600 }}
              labelStyle={{ color: "#6B7280", marginBottom: "4px" }}
            />
            
            {/* Styled Bars */}
            <Bar 
              dataKey="avgYield" 
              name="Avg Yield"
              radius={[6, 6, 0, 0]} // Rounds the top-left and top-right corners
              maxBarSize={50} // Prevents bars from getting too wide on large screens
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
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