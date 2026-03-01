import { useState } from "react";
import API from "../../api/axios";
import { 
  MapPin, 
  Leaf, 
  Sprout, 
  Loader2, 
  Thermometer, 
  Droplets, 
  CloudRain,
  AlertCircle
} from "lucide-react";
import ResultCard from "./ResultCard"; // Adjust import path if necessary

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

interface PredictionResponse {
  predictedYield: number;
  weather: WeatherData;
}

const PredictForm = () => {
  const [location, setLocation] = useState<string>("");
  const [soilType, setSoilType] = useState<string>("");
  const [cropType, setCropType] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handlePredict = async () => {
    // Replaced browser alert with smooth inline error
    if (!location || !soilType || !cropType) {
      setError("Please fill in all fields before predicting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setWeather(null);

      const response = await API.post<PredictionResponse>(
        "/api/predictions/predict",
        {
          location,
          soil_type: soilType,
          crop_type: cropType,
        }
      );

      if (response.data) {
        setWeather(response.data.weather);
        setResult(response.data.predictedYield);
      }
    } catch (err) {
      console.error("Prediction Error:", err);
      setError("Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // This outer div handles the perfect vertical and horizontal centering
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full py-8">
      
      <div className="w-full max-w-2xl bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-4">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Predict Crop Yield
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Enter your region and crop details to get an AI-powered yield estimation.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-5">
          {/* Location Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Chennai, Tamil Nadu"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Soil Type Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Soil Type</label>
              <div className="relative">
                <Leaf className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., Alluvial, Clay"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  value={soilType}
                  onChange={(e) => {
                    setSoilType(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>
            </div>

            {/* Crop Type Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Crop Type</label>
              <div className="relative">
                <Sprout className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., Rice, Wheat"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  value={cropType}
                  onChange={(e) => {
                    setCropType(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            "Generate Prediction"
          )}
        </button>

        {/* --- Results Section --- */}
        {(weather || result !== null) && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            
            {/* Weather Card */}
            {weather && (
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CloudRain className="w-4 h-4" />
                  Live Weather Context
                </h3>
                
                <div className="grid grid-cols-3 gap-4 divide-x divide-blue-200/60">
                  <div className="text-center">
                    <Thermometer className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-blue-600/70 font-medium">Temp</p>
                    <p className="text-lg font-bold text-blue-900">{weather.temperature}°C</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-blue-600/70 font-medium">Humidity</p>
                    <p className="text-lg font-bold text-blue-900">{weather.humidity}%</p>
                  </div>
                  <div className="text-center">
                    <CloudRain className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-blue-600/70 font-medium">Rainfall</p>
                    <p className="text-lg font-bold text-blue-900">{weather.rainfall} <span className="text-sm font-medium text-blue-700">mm</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Result Component */}
            {result !== null && <ResultCard predictedYield={result} />}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictForm;