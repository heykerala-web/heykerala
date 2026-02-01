"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ItineraryHeader from "@/components/itinerary/ItineraryHeader";
import DayAccordion from "@/components/itinerary/DayAccordion";

const LeafletMapView = dynamic(() => import("@/components/itinerary/LeafletMapView"), { ssr: false });
import BudgetBreakdown from "@/components/itinerary/BudgetBreakdown";
import HotelsGrid from "@/components/itinerary/HotelsGrid";
import ActionButtons from "@/components/itinerary/ActionButtons";

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

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  distanceKm: number;
  image: string;
}

interface Itinerary {
  id: string;
  title: string;
  duration: number;
  travelers: string;
  budgetEstimate: { min: number; max: number };
  heroImage: string;
  aiReason?: string | null;
  days: Day[];
  hotels: Hotel[];
  budgetBreakdown: {
    stay: number;
    food: number;
    travel: number;
    tickets: number;
    extras: number;
  };
}

export default function ItineraryResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (!dataParam) {
      setError("No itinerary data found. Please generate a new itinerary.");
      setLoading(false);
      return;
    }

    try {
      const decoded = decodeURIComponent(dataParam);
      const parsed = JSON.parse(decoded);
      setItinerary(parsed);
    } catch (err) {
      console.error("Error parsing itinerary data:", err);
      setError("Invalid itinerary data. Please generate a new itinerary.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Itinerary not found"}</p>
          <button
            onClick={() => router.push("/plan-trip")}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            Create New Itinerary
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <ItineraryHeader
          title={itinerary.title}
          duration={itinerary.duration}
          travelers={itinerary.travelers}
          budgetEstimate={itinerary.budgetEstimate}
          heroImage={itinerary.heroImage}
          aiReason={itinerary.aiReason}
        />

        {/* Action Buttons */}
        <div className="mb-8">
          <ActionButtons itineraryId={itinerary.id} itineraryData={itinerary} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary Days */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📅</span>
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-4">
                {itinerary.days.map((day) => (
                  <DayAccordion key={day.day} day={day} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Map & Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🗺️</span>
                Route Map
              </h2>
              <LeafletMapView days={itinerary.days} />
            </div>

            {/* Budget Breakdown */}
            <BudgetBreakdown
              budgetBreakdown={itinerary.budgetBreakdown}
              budgetEstimate={itinerary.budgetEstimate}
            />
          </div>
        </div>

        {/* Hotels Section */}
        {itinerary.hotels && itinerary.hotels.length > 0 && (
          <div className="mt-8">
            <HotelsGrid hotels={itinerary.hotels} />
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/plan-trip")}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
          >
            ← Create Another Itinerary
          </button>
        </div>
      </div>
    </main>
  );
}
