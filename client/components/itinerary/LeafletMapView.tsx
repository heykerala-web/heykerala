"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Types and Props (Leaflet config moved to useEffect)


interface Activity {
  time: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
}

interface Day {
  day: number;
  activities: Activity[];
  mapPolyline: number[][];
}

interface LeafletMapViewProps {
  days: Day[];
}

export default function LeafletMapView({ days }: LeafletMapViewProps) {
  // Collect all activities
  const allActivities = days.flatMap((day) => day.activities);

  // Get center from first activity
  const center: [number, number] = allActivities[0]
    ? [allActivities[0].lat, allActivities[0].lng]
    : [10.5276, 76.2144]; // Default Kerala center

  // Collect all polylines
  const allPolylines = days
    .filter((day) => day.mapPolyline && day.mapPolyline.length > 0)
    .map((day) => day.mapPolyline);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix for default marker icons in Next.js (client-side only)
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    }
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers for all activities */}
        {allActivities.map((activity, index) => (
          <Marker
            key={index}
            position={[activity.lat, activity.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-emerald-700 mb-1">{activity.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{activity.desc}</p>
                <p className="text-xs text-gray-500">⏰ {activity.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Polylines for each day */}
        {allPolylines.map((polyline, dayIndex) => (
          <Polyline
            key={dayIndex}
            positions={polyline.map(([lat, lng]) => [lat, lng] as [number, number])}
            pathOptions={{
              color: dayIndex === 0 ? "#10b981" : "#059669",
              weight: 4,
              opacity: 0.7,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

