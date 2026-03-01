import { useEffect, useState } from "react";
import { 
  Trash2, 
  Search, 
  Leaf, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X 
} from "lucide-react";
import {
  getAllPredictions,
  deletePrediction,
} from "../../api/admin.api";

interface Prediction {
  id: string;
  crop_type: string;
  predicted_yield: number;
  actual_yield: number | null;
}

const PredictionManagementTable = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await getAllPredictions();
        if (Array.isArray(data)) {
          setPredictions(data);
          setError(null);
        }
      } catch {
        setError("Failed to synchronize prediction database.");
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      await deletePrediction(id);
      setPredictions((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("System failed to delete the record.");
    }
  };

  const filteredData = predictions.filter(p => 
    p.crop_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <PredictionSkeleton />;

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            Prediction Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Audit and manage system-wide yield forecasts</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="text-left px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Crop Species</th>
              <th className="text-left px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Predicted Yield</th>
              <th className="text-left px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actual Result</th>
              <th className="text-left px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="text-right px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((p) => {
              const isCompleted = p.actual_yield !== null;
              return (
                <tr key={p.id} className="group hover:bg-slate-50/40 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-700 capitalize">{p.crop_type}</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                    {p.predicted_yield.toFixed(2)} <span className="text-[10px] text-slate-400 ml-0.5">t/ha</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-900 font-bold">
                    {isCompleted ? (
                      <>{p.actual_yield?.toFixed(2)} <span className="text-[10px] text-slate-400 ml-0.5">t/ha</span></>
                    ) : (
                      <span className="text-slate-300 italic font-normal text-xs">Awaiting data</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      isCompleted 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isCompleted ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!filteredData.length && (
          <div className="p-20 text-center">
             <div className="inline-flex p-5 bg-slate-50 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-semibold tracking-tight">No predictions found.</p>
             <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PredictionSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse">
    <div className="h-6 w-48 bg-slate-100 rounded-lg mb-8" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 w-full bg-slate-50 rounded-2xl" />
      ))}
    </div>
  </div>
);

export default PredictionManagementTable;