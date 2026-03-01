export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface Prediction {
  id: string;
  location: string;
  crop_type: string;
  soil_type: string;
  fertilizer: string;
  area: number;
  predicted_yield: number;
  weather: WeatherData;
  created_at: string;
}