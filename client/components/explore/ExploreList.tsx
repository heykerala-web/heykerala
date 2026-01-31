import { useRef, useEffect } from "react";
import { Star, MapPin } from "lucide-react";

interface ExploreListProps {
    places: any[];
    loading: boolean;
    onSelect: (place: any) => void;
    selectedId?: string;
}

export function ExploreList({ places, loading, onSelect, selectedId }: ExploreListProps) {
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        if (selectedId && itemRefs.current[selectedId]) {
            itemRefs.current[selectedId]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [selectedId]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (places.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>No places found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {places.map((place) => (
                <div
                    key={place._id}
                    ref={(el) => {
                        // Correctly assign to mutable ref object
                        if (el) itemRefs.current[place._id] = el;
                    }}
                    onClick={() => onSelect(place)}
                    className={`group flex items-start gap-4 p-3 rounded-2xl transition-all cursor-pointer border ${selectedId === place._id ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-md transform scale-[1.02]' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                >
                    <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
                        <img
                            src={place.images?.[0] || place.image || "/placeholder.svg"}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {selectedId === place._id && (
                            <div className="absolute inset-0 bg-emerald-500/10" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start">
                            <h3 className={`font-bold text-lg truncate pr-2 ${selectedId === place._id ? 'text-emerald-900' : 'text-gray-900'}`}>{place.name}</h3>
                            {place.ratingAvg > 0 && (
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    {place.ratingAvg}
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mt-1 capitalize">{place.category}</p>

                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="truncate">{place.district}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {place.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="text-xs px-2 py-1 bg-white border border-gray-100 rounded-md text-gray-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
