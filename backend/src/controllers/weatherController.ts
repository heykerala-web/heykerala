import { Request, Response } from "express";

// Simple in-memory cache (in production, use Redis)
const weatherCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const cacheKey = `${lat},${lon}`;
    const cached = weatherCache.get(cacheKey);

    // Check if cached data is still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    // Get API key from environment
    const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Weather API key not configured",
      });
    }

    // Try OpenWeatherMap first, fallback to WeatherAPI.com
    let weatherData;

    try {
      // OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("OpenWeatherMap API error");
      }

      const data = await response.json();

      weatherData = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        pressure: data.main.pressure,
        visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      // Fallback to WeatherAPI.com if OpenWeatherMap fails
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
        );

        if (!response.ok) {
          throw new Error("WeatherAPI error");
        }

        const data = await response.json();

        weatherData = {
          temperature: Math.round(data.current.temp_c),
          feelsLike: Math.round(data.current.feelslike_c),
          condition: data.current.condition.text,
          description: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
          windDirection: data.current.wind_degree,
          pressure: data.current.pressure_mb,
          visibility: data.current.vis_km,
          lastUpdated: new Date().toISOString(),
        };
      } catch (fallbackError) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch weather data",
        });
      }
    }

    // Cache the data
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      data: weatherData,
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching weather:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching weather",
      error: error.message,
    });
  }
};






