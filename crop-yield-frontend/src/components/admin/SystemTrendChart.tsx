import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3, Info } from "lucide-react";

interface MonthlyTrend {
  month: string;
  predictions: number;
  avgYield: number;
}

interface Props {
  data?: MonthlyTrend[];
}

const SystemTrendChart = ({ data }: Props) => {
  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center justify-center min-h-75 animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-100">
          <BarChart3 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">No Trend Data</h3>
        <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed">
          Monthly analytics will populate once the system records prediction activity.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- Premium Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            Prediction & Yield Trends
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Monitoring system usage volume against average agricultural output.
          </p>
        </div>

        {/* Floating Legends */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield</span>
          </div>
        </div>
      </div>

      {/* --- Chart Container --- */}
      <div className="h-80 min-h-75 w-full">
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}t`}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(8px)',
                borderRadius: '20px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '16px',
              }}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
              // RECTIFIED: Added safety for number | undefined and safe string return
              formatter={(value: number | undefined, name: string | undefined) => {
                const safeValue = value ?? 0;
                const safeName = name ?? "";
                
                if (safeName === "predictions") return [safeValue, "Predictions Logged"];
                if (safeName === "avgYield") return [`${safeValue.toFixed(2)} t/ha`, "Average Yield"];
                return [safeValue, safeName];
              }}
              labelStyle={{ color: '#64748b', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
            />
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="predictions" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorPredictions)" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
              animationDuration={2000}
            />

            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="avgYield" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorYield)" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- Performance Insight Footer --- */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-400">
        <Info className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider italic">
          Data is synchronized every 24 hours from harvested logs.
        </span>
      </div>
    </div>
  );
};

export default SystemTrendChart;