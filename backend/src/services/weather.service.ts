import axios from "axios";
import { env } from "../config/env";

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const weatherCache = new Map<string, { data: WeatherData; expiry: number }>();

export class WeatherService {

  static async getWeatherByCity(city: string): Promise<WeatherData> {

    // 🔹 Basic 5 min cache
    const cached = weatherCache.get(city);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    try {
      const response = await axios.get(env.OPENWEATHER_BASE_URL, {
        timeout: 5000, // ⏱ timeout protection
        params: {
          q: city,
          appid: env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      });

      const data = response.data;

      const weather: WeatherData = {
        temperature: Number(data.main?.temp),
        humidity: Number(data.main?.humidity),
        rainfall: data.rain?.["1h"] ? Number(data.rain["1h"]) : 0,
      };

      weatherCache.set(city, {
        data: weather,
        expiry: Date.now() + 5 * 60 * 1000,
      });

      return weather;

    } catch (error: any) {

      if (error.code === "ECONNABORTED") {
        throw new Error("Weather API timeout");
      }

      if (error.response?.data?.message) {
        throw new Error(`Weather API Error: ${error.response.data.message}`);
      }

      throw new Error("Failed to fetch weather data");
    }
  }
}