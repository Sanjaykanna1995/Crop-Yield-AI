import { TrendingUp, Sprout } from "lucide-react";

interface ResultCardProps {
  predictedYield: number;
}

const ResultCard = ({ predictedYield }: ResultCardProps) => {
  return (
    <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 sm:p-8 rounded-2xl shadow-lg border border-emerald-400 text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Decorative background icon */}
      <Sprout className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h3 className="text-emerald-100 font-medium tracking-wide mb-1 uppercase text-sm">
            Predicted Yield Outcome
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {predictedYield.toFixed(2)}
            </span>
            <span className="text-lg text-emerald-100 font-medium">tons/hectare</span>
          </div>
        </div>

        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;