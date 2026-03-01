"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = __importDefault(require("axios"));
const weatherCache = new Map();
class WeatherService {
    static async getWeatherByCity(city) {
        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            if (!apiKey) {
                throw new Error("Weather API key not configured");
            }
            const response = await axios_1.default.get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                    q: `${city},IN`, // 👈 important
                    appid: apiKey,
                    units: "metric",
                },
            });
            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                rainfall: response.data.rain?.["1h"] || 0,
            };
        }
        catch (error) {
            console.error("Weather API Full Error:", error.response?.data || error.message);
            throw new Error("Weather API Error: city not found");
        }
    }
}
exports.WeatherService = WeatherService;
