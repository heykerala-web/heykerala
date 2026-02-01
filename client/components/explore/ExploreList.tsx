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
        <div className="grid grid-cols-1 gap-4 py-4">
            {places.map((place) => (
                <div
                    key={place._id}
                    ref={(el) => {
                        if (el) itemRefs.current[place._id] = el;
                    }}
                    onClick={() => onSelect(place)}
                    className={`group flex items-center gap-5 p-4 rounded-3xl transition-all cursor-pointer border ${selectedId === place._id ? 'border-primary bg-primary/5 shadow-xl ring-1 ring-primary/20 scale-[1.02]' : 'border-transparent hover:bg-white hover:shadow-lg hover:border-white/20'}`}
                >
                    <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-muted relative shadow-sm">
                        <img
                            src={place.images?.[0] || place.image || "/placeholder.svg"}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full">
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">{place.category}</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-bold text-lg truncate pr-2 ${selectedId === place._id ? 'text-primary' : 'text-foreground group-hover:text-primary transition-colors'}`}>{place.name}</h3>
                            {place.ratingAvg > 0 && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 rounded-full shrink-0">
                                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                    <span className="text-xs font-bold text-accent">{place.ratingAvg}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium mb-3">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>{place.district}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {place.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="text-[10px] px-2.5 py-1 bg-muted rounded-full text-muted-foreground font-semibold uppercase tracking-wider">
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
