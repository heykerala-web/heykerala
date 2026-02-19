"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";

// Types and Props (Leaflet config moved to useEffect)
interface MarkerData {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  height?: string;
  className?: string;
  scrollWheelZoom?: boolean;
}

export default function LeafletMap({
  center = [10.5276, 76.2144], // Default Kerala center
  zoom = 8,
  markers = [],
  height = "400px",
  className = "",
  scrollWheelZoom = false,
}: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix for default marker icons in Next.js (client-side only)
    if (typeof window !== "undefined") {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;

      const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl,
      });
    }
  }, []);

  if (!isClient) {
    return (
      <div
        className={`w-full bg-gray-200 rounded-3xl flex items-center justify-center animate-pulse ${className}`}
        style={{ height }}
      >
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-3xl overflow-hidden border-2 border-emerald-200 shadow-lg ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={scrollWheelZoom}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite (Esri)">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            {(marker.title || marker.description) && (
              <Popup>
                <div className="p-2">
                  {marker.title && (
                    <h3 className="font-bold text-emerald-700 mb-1">{marker.title}</h3>
                  )}
                  {marker.description && (
                    <p className="text-sm text-gray-600">{marker.description}</p>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}






