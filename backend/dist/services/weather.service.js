"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const weatherCache = new Map();
class WeatherService {
    static async getWeatherByCity(city) {
        // 🔹 Basic 5 min cache
        const cached = weatherCache.get(city);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        try {
            const response = await axios_1.default.get(env_1.env.OPENWEATHER_BASE_URL, {
                timeout: 5000, // ⏱ timeout protection
                params: {
                    q: city,
                    appid: env_1.env.OPENWEATHER_API_KEY,
                    units: "metric",
                },
            });
            const data = response.data;
            const weather = {
                temperature: Number(data.main?.temp),
                humidity: Number(data.main?.humidity),
                rainfall: data.rain?.["1h"] ? Number(data.rain["1h"]) : 0,
            };
            weatherCache.set(city, {
                data: weather,
                expiry: Date.now() + 5 * 60 * 1000,
            });
            return weather;
        }
        catch (error) {
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
exports.WeatherService = WeatherService;
