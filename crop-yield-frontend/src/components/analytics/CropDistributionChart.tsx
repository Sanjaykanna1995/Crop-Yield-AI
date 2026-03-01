import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CropDistributionChartProps {
  data: Array<{ crop: string; count: number }>;
}

// An earthy, vibrant palette perfect for crops/soils
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

const CropDistributionChart = ({ data }: CropDistributionChartProps) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Crop Distribution
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Breakdown of current agricultural allocation
      </p>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="crop"
              cx="50%"
              cy="50%"
              innerRadius={75} // Creates the donut hole
              outerRadius={105}
              paddingAngle={4} // Adds spacing between slices
              stroke="none" // Removes default borders
              cornerRadius={6} // Rounds the edges of the slices
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              itemStyle={{ color: "#374151", fontWeight: 500 }}
            />
            
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-gray-600 font-medium ml-1.5">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CropDistributionChart;