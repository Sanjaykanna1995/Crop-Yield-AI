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
  ValueType,
  Payload
} from "recharts/types/component/DefaultTooltipContent";

import type { HumidityAnalysisItem } from "../../types/analytics.types";

interface Props {
  data: HumidityAnalysisItem[];
}

/**
 * Custom Tooltip with strict typing for Recharts Payload
 * This eliminates the "@typescript-eslint/no-explicit-any" errors
 */
const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props as TooltipProps<ValueType, NameType> & { payload?: Payload<ValueType, NameType>[] };
  if (active && payload && payload.length) {
    const label = payload[0]?.payload?.humidity;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 shadow-xl rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Humidity: {label}%
        </p>
        {payload.map((entry: Payload<ValueType, NameType>) => (
          <div key={entry.name} className="flex items-center justify-between gap-6 mb-1.5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              {entry.name}:
            </span>
            <span className="text-sm font-bold text-slate-900">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HumidityYieldChart = ({ data }: Props) => {
  return (
    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Humidity vs Yield
          </h3>
          <p className="text-sm text-slate-500 mt-1">Impact of air moisture on production output</p>
        </div>
        
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span className="text-xs font-bold text-amber-700 uppercase">Actual</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50/50 rounded-xl border border-sky-100">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              <span className="text-xs font-bold text-sky-700 uppercase">Predicted</span>
           </div>
        </div>
      </div>

      {/* Changed to h-88 to align with Tailwind's canonical spacing scale (22rem / 352px) */}
      <div className="h-88 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="#f1f5f9" 
            />

            <XAxis
              dataKey="humidity"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
              unit="%"
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
              stroke="#0ea5e9"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
            />

            <Line
              name="Actual"
              type="monotone"
              dataKey="actual"
              stroke="#f59e0b"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HumidityYieldChart;