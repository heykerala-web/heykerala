"use client";

import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets } from "lucide-react";

interface PlaceWeatherProps {
    weather: {
        temperature: number;
        weathercode: number;
        windspeed: number;
    };
}

export default function PlaceWeather({ weather }: PlaceWeatherProps) {
    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-8 w-8 text-yellow-400" />;
        if (code <= 3) return <Cloud className="h-8 w-8 text-blue-300" />;
        if (code <= 67) return <CloudRain className="h-8 w-8 text-blue-400" />;
        if (code <= 82) return <CloudRain className="h-8 w-8 text-blue-500" />;
        return <CloudLightning className="h-8 w-8 text-purple-400" />;
    };

    const getCondition = (code: number) => {
        if (code === 0) return "Sunny";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 67) return "Rainy";
        if (code <= 82) return "Heavy Rain";
        return "Stormy";
    };

    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 flex items-center gap-6 shadow-2xl animate-fade-in">
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
                {getWeatherIcon(weather.weathercode)}
            </div>
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{weather.temperature}°C</span>
                    <span className="text-white/60 font-medium">{getCondition(weather.weathercode)}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-white/70 font-semibold uppercase tracking-wider">
                        <Wind className="h-3 w-3" />
                        {weather.windspeed} km/h
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="text-[10px] text-accent font-bold uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded">
                        Best time to visit
                    </div>
                </div>
            </div>
        </div>
    );
}
