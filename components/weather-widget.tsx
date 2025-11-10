"use client"

import { Cloud, Droplets, Sun, Wind, CloudRain } from "lucide-react"

export function WeatherWidget() {
  const weather = {
    location: "Kochi, Kerala",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 12,
    icon: "partly-cloudy",
  }

  const icon =
    weather.icon === "sunny" ? (
      <Sun className="h-8 w-8 text-yellow-400" />
    ) : weather.icon === "rainy" ? (
      <CloudRain className="h-8 w-8 text-blue-500" />
    ) : (
      <Cloud className="h-8 w-8 text-white/90" />
    )

  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Current Weather</h3>

      <div className="text-center mb-4">
        <div className="mb-2 flex justify-center">{icon}</div>
        <div className="text-3xl font-bold mb-1">{weather.temperature}°C</div>
        <div className="text-sm/relaxed opacity-90">{weather.condition}</div>
        <div className="text-sm opacity-75">{weather.location}</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="mr-2 h-4 w-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <span className="text-sm font-medium">{weather.humidity}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wind className="mr-2 h-4 w-4" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <span className="text-sm font-medium">{weather.windSpeed} km/h</span>
        </div>
      </div>

      <p className="mt-4 border-t border-white/20 pt-4 text-center text-xs opacity-75">
        Perfect weather for exploring Kerala!
      </p>
    </div>
  )
}
