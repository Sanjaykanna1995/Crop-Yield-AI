import { useState, useRef, useEffect } from "react";
import API from "../../api/axios";
import Spinner from "../common/Spinner";
import { X, Scale, AlertCircle } from "lucide-react";

interface BackendPrediction {
  id: string;
  actual_yield?: number | null;
  crop_type?: string | null; // Optional: used for better context in UI
}

interface UpdateModalProps {
  prediction: BackendPrediction;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateModal = ({
  prediction,
  onClose,
  onSuccess,
}: UpdateModalProps) => {
  const [actualYield, setActualYield] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!actualYield || Number(actualYield) <= 0) {
      setError("Please enter a valid yield amount greater than 0.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await API.patch(`/api/predictions/${prediction.id}`, {
        actual_yield: Number(actualYield),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    // Overlay with backdrop blur
    <div 
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            Record Actual Yield
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-5">
            Enter the final harvested yield for your {prediction.crop_type ? <span className="font-bold text-gray-700">{prediction.crop_type}</span> : "crop"}. This helps improve future AI predictions.
          </p>

          <div className="relative mb-2">
            <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={actualYield}
              onChange={(e) => {
                setActualYield(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-lg font-medium text-gray-900"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
              tons/ha
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {loading && <Spinner />}
            {loading ? "Saving..." : "Save Yield Data"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateModal;