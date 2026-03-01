import axios from "axios";
import { env } from "../config/env";

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const weatherCache = new Map<string, { data: WeatherData; expiry: number }>();

export class WeatherService {

  static async getWeatherByCity(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("Weather API key not configured");
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: `${city},IN`,   // 👈 important
          appid: apiKey,
          units: "metric",
        },
      }
    );

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      rainfall: response.data.rain?.["1h"] || 0,
    };

  } catch (error: any) {
    console.error("Weather API Full Error:", error.response?.data || error.message);
    throw new Error("Weather API Error: city not found");
  }
}
}