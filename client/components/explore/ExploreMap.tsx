"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Types and Icons (Icons moved inside component)


// Helper to fit map bounds
function MapUpdater({ places, selectedPlace }: { places: any[], selectedPlace: any }) {
    const map = useMap();

    useEffect(() => {
        if (selectedPlace && selectedPlace.latitude && selectedPlace.longitude) {
            map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 10, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedPlace, map]);

    useEffect(() => {
        // If we have places but no selection, fit bounds to show all
        if (places.length > 0 && !selectedPlace) {
            try {
                const bounds = L.latLngBounds(places.map(p => [p.latitude || 10.8505, p.longitude || 76.2711]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
            } catch (e) { console.log(e) }
        }
    }, [places, map]);

    return null;
}

interface ExploreMapProps {
    places: any[];
    selectedPlace: any;
    onSelect: (place: any) => void;
}

export default function ExploreMap({ places, selectedPlace, onSelect }: ExploreMapProps) {
    // Kerala Center
    const defaultCenter: [number, number] = [10.850516, 76.271083];

    // Icons state
    const [icons, setIcons] = useState<any>(null);

    useEffect(() => {
        // Ensure this runs only on client
        if (typeof window === "undefined") return;

        // Fix Leaflet's default icon path issues
        // We only need to construct these once
        const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

        setIcons({
            default: L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            selected: L.icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        });
    }, []);

    // Return placeholder if icons aren't ready (prevents hydration mismatch)
    if (!icons) {
        return <div className="h-full w-full bg-gray-100 animate-pulse" />;
    }

    return (
        <div className="h-full w-full z-0">
            <MapContainer
                center={defaultCenter}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full outline-none"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {places.map((place) => {
                    if (!place.latitude || !place.longitude) return null;
                    return (
                        <Marker
                            key={place._id}
                            position={[place.latitude, place.longitude]}
                            icon={selectedPlace?._id === place._id ? icons.selected : icons.default}
                            eventHandlers={{
                                click: () => onSelect(place),
                            }}
                        />
                    )
                })}

                <MapUpdater places={places} selectedPlace={selectedPlace} />
            </MapContainer>
        </div>
    );
}
