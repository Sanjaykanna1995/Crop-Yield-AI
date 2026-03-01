import React from "react";
import type { SystemAnalyticsResponse } from "../../types/admin.types";
import { 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Target 
} from "lucide-react";

interface Props {
  data: SystemAnalyticsResponse;
}

interface CardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
}

const KPICard = ({ label, value, icon: Icon, colorClass, bgClass }: CardProps) => (
  <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between h-full">
    
    {/* Background Decorative Watermark Icon */}
    <Icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ${colorClass}`} />

    <div className="relative z-10">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 ${bgClass}`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass}`} />
      </div>
      
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
          {typeof value === 'number' ? new Intl.NumberFormat().format(value) : value}
        </h3>
        <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  </div>
);

const SystemKPISection = ({ data }: Props) => {
  const cards = [
    { 
      label: "Total Users", 
      value: data.totalUsers,
      icon: Users,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50"
    },
    { 
      label: "Total Predictions", 
      value: data.totalPredictions,
      icon: BarChart3,
      colorClass: "text-indigo-600",
      bgClass: "bg-indigo-50"
    },
    { 
      label: "Completed", 
      value: data.completed,
      icon: CheckCircle2,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50"
    },
    { 
      label: "Pending", 
      value: data.pending,
      icon: Clock,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-50"
    },
    { 
      label: "Accuracy Rate", 
      value: `${data.accuracy}%`,
      icon: Target,
      colorClass: "text-rose-600",
      bgClass: "bg-rose-50"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cards.map((card, index) => (
        <KPICard 
          key={index}
          label={card.label}
          value={card.value}
          icon={card.icon}
          colorClass={card.colorClass}
          bgClass={card.bgClass}
        />
      ))}
    </div>
  );
};

export default SystemKPISection;