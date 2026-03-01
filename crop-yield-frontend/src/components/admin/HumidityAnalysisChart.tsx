
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
import type { SystemAnalyticsResponse } from "../../types/admin.types";

interface Props {
  data: SystemAnalyticsResponse;
}

/**
 * Custom Tooltip with strict typing for Recharts Payload
 * Eliminates TypeScript "any" warnings
 */
const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props as TooltipProps<ValueType, NameType> & { 
    payload?: Payload<ValueType, NameType>[] 
  };

  if (active && payload && payload.length) {
    const label = payload[0]?.payload?.humidity;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 shadow-xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-slate-100 pb-2">
          Humidity: {label}%
        </p>
        {payload.map((entry: Payload<ValueType, NameType>) => (
          <div key={entry.name} className="flex items-center justify-between gap-8 mb-2 last:mb-0">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              {entry.name}:
            </span>
            <span className="text-sm font-bold text-slate-900">
              {entry.value !== null ? entry.value?.toLocaleString() : "Pending"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HumidityYieldChart = ({ data }: Props) => {
  const chartData = data.humidityAnalysis;

  return (
    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Humidity vs Yield
          </h3>
          <p className="text-sm text-slate-500 mt-1">Impact of air moisture on production output</p>
        </div>
        
        {/* Thematic Legend Badges */}
        <div className="flex gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 rounded-xl border border-amber-100/50">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Actual</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50/50 rounded-xl border border-sky-100/50">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
              <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider">Predicted</span>
           </div>
        </div>
      </div>

      <div className="h-88 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="#f1f5f9" 
            />

            <XAxis
              dataKey="humidity"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={15}
              unit="%"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
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
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#0ea5e9' }}
              animationDuration={2000}
            />

            <Line
              name="Actual"
              type="monotone"
              dataKey="actual"
              stroke="#f59e0b"
              strokeWidth={4}
              dot={false}
              connectNulls
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#f59e0b' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HumidityYieldChart;