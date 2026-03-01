import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import Spinner from "../common/Spinner";
import UpdateModal from "./UpdateModal";
import { 
  Calendar, 
  Sprout, 
  Leaf, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Clock, 
  CheckCircle2,
  Inbox
} from "lucide-react";

interface Prediction {
  id: string;
  temperature: number | null;
  rainfall: number | null;
  humidity: number | null;
  soil_type: string | null;
  crop_type: string | null;
  predicted_yield: number | null;
  actual_yield: number | null;
  status: "PENDING" | "COMPLETED";
  created_at: string;
  updated_at: string;
}

const HistoryTable = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Extracted so we can call it after a successful update without reloading the page!
  const fetchPredictions = useCallback(async () => {
    try {
      const response = await API.get("/api/predictions");
      if (Array.isArray(response.data)) {
        setPredictions(response.data);
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load prediction history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Spinner />
        <p className="text-gray-500 font-medium animate-pulse">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-lg mx-auto">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={fetchPredictions}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!predictions.length) {
    return (
      <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Predictions Yet</h3>
        <p className="text-gray-500">Go to the Predict tab to generate your first crop yield estimate.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {predictions.map((p) => {
          const isCompleted = p.actual_yield !== null;

          return (
            <div 
              key={p.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header: Date & Status */}
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  {p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date"}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {isCompleted ? "Completed" : "Pending"}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                
                {/* Crop & Soil */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {p.crop_type || "Unknown Crop"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <Leaf className="w-3.5 h-3.5" />
                      {p.soil_type || "Unknown Soil"}
                    </div>
                  </div>
                </div>

                {/* Weather Minis */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 mb-5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Thermometer className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{p.temperature ?? "-"}°C</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
                    <Droplets className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{p.humidity ?? "-"}%</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-l border-gray-100">
                    <CloudRain className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">{p.rainfall ?? "-"}mm</span>
                  </div>
                </div>

                {/* Yield Comparison */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Predicted</p>
                    <p className="text-lg font-bold text-gray-900">
                      {p.predicted_yield ? p.predicted_yield.toFixed(2) : "-"}
                      <span className="text-xs font-medium text-gray-500 ml-1">t/ha</span>
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 border ${isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 border-dashed'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isCompleted ? 'text-emerald-600/70' : 'text-gray-400'}`}>Actual</p>
                    {isCompleted ? (
                       <p className="text-lg font-bold text-emerald-700">
                         {p.actual_yield!.toFixed(2)}
                         <span className="text-xs font-medium text-emerald-600/70 ml-1">t/ha</span>
                       </p>
                    ) : (
                      <button 
                        onClick={() => setSelectedPrediction(p)}
                        className="w-full text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1"
                      >
                        + Add Yield
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {selectedPrediction && (
        <UpdateModal
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
          onSuccess={fetchPredictions} // Passing the fetch function instead of reloading!
        />
      )}
    </>
  );
};

export default HistoryTable;