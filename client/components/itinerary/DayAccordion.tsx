"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ActivityCard from "./ActivityCard";

interface Activity {
  time: string;
  name: string;
  desc: string;
  image: string;
  duration: string;
  cost: number;
  lat: number;
  lng: number;
}

interface Day {
  day: number;
  activities: Activity[];
  mapPolyline: number[][];
}

interface DayAccordionProps {
  day: Day;
}

export default function DayAccordion({ day }: DayAccordionProps) {
  const [isOpen, setIsOpen] = useState(day.day === 1); // Open first day by default

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
      {/* Day Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-lg">
            Day {day.day}
          </div>
          <span className="text-lg font-semibold">
            {day.activities.length} Activities Planned
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Day Content */}
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {day.activities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}








