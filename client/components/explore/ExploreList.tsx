import { useRef, useEffect } from "react";
import { Star, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreListProps {
    places: any[];
    loading: boolean;
    onSelect: (place: any) => void;
    selectedId?: string;
}

import { SmartImage } from "../ui/SmartImage";

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
            <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-44 bg-muted animate-pulse rounded-3xl" />
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
        <div className="flex flex-col gap-4 py-4 px-2">
            {places.map((place) => {
                const categoryRaw = place.category?.toLowerCase() || 'place';
                const category = (categoryRaw.includes('restaurant') || categoryRaw.includes('food')) ? 'restaurant' :
                    (categoryRaw.includes('stay') || categoryRaw.includes('hotel')) ? 'stay' :
                        (categoryRaw.includes('event')) ? 'event' : 'place';

                return (
                    <div
                        key={place._id}
                        ref={(el) => {
                            if (el) itemRefs.current[place._id] = el;
                        }}
                        onClick={() => onSelect(place)}
                        className={cn(
                            "group flex gap-4 p-3 rounded-2xl border transition-all duration-300 cursor-pointer",
                            selectedId === place._id
                                ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                                : "border-transparent bg-white hover:bg-slate-50 hover:shadow-lg hover:border-slate-100 placeholder:bg-slate-100"
                        )}
                    >
                        <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted relative shadow-sm">
                            <SmartImage
                                src={place.image}
                                images={place.images}
                                alt={place.name}
                                category={category as any}
                                fallbackName={place.name}
                                className="group-hover:scale-110 transition-transform duration-700"
                                aspectRatio="none"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full z-10">
                                <span className="text-[9px] text-white font-bold uppercase tracking-wider">{place.category}</span>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={cn(
                                        "font-bold text-base truncate pr-2 transition-colors",
                                        selectedId === place._id ? "text-primary" : "text-foreground group-hover:text-primary"
                                    )}>{place.name}</h3>
                                    {place.ratingAvg > 0 && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded-md shrink-0">
                                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                            <span className="text-[10px] font-bold text-amber-700">{place.ratingAvg}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium mb-2">
                                    <MapPin className="h-3 w-3 text-primary/70" />
                                    <span>{place.district}</span>
                                </div>

                                {place.openingHours && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit mb-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{place.openingHours}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {place.tags?.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="text-[9px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
