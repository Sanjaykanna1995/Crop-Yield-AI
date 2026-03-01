import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// Fix 1: Use 'import type' for type-only imports to satisfy verbatimModuleSyntax
import type { TooltipProps } from "recharts";
import type { 
  NameType, 
  ValueType 
} from "recharts/types/component/DefaultTooltipContent";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

import type { TemperatureAnalysisItem } from "../../types/analytics.types";

interface Props {
  data: TemperatureAnalysisItem[];
}

/**
 * Custom Tooltip component
 * Fix 2: Explicitly typing the props object to avoid 'property does not exist' errors
 */
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType> & { payload?: Payload<ValueType, NameType>[] }) => {
  if (active && payload && payload.length) {
    const tempLabel = payload[0]?.payload?.temperature;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-4 shadow-xl rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Temp: {tempLabel}°C
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1.5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              {entry.name}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TemperatureYieldChart = ({ data }: Props) => {
  return (
    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Temperature vs Yield
          </h3>
          <p className="text-sm text-slate-500 mt-1">Predictive analysis of crop output</p>
        </div>
        
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
              <span className="text-xs font-bold text-indigo-600 uppercase">Actual</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs font-bold text-emerald-600 uppercase">Predicted</span>
           </div>
        </div>
      </div>

      {/* Fix 3: Standard Tailwind class h-80 or h-96 is preferred over arbitrary [350px] */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="#f1f5f9" 
            />

            <XAxis
              dataKey="temperature"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
              unit="°C"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} 
            />

            <Line
              name="Predicted"
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />

            <Line
              name="Actual"
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureYieldChart;