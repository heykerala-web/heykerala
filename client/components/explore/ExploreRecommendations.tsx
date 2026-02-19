"use client"

import * as React from "react"
import { Sparkles, Star, MapPin, ChevronRight } from "lucide-react"
import { API_URL, tokenManager } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Recommendation {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    ratingAvg: number;
    category: string;
    district: string;
}

interface ExploreRecommendationsProps {
    onSelect: (place: any) => void;
}

export function ExploreRecommendations({ onSelect }: ExploreRecommendationsProps) {
    const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const hour = new Date().getHours();
                let weatherParam = "Sunny";
                if (hour >= 18 || hour < 6) weatherParam = "Rainy";

                const token = tokenManager.get();
                const headers: any = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/ai/recommendations?weather=${weatherParam}`, { headers });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRecommendations(data.slice(0, 4)); // Only top 4 for sidebar
                }
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading || recommendations.length === 0) return null;

    return (
        <div className="mb-8 px-2">
            <div className="flex items-center gap-2 mb-4 px-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-outfit font-bold text-sm">Suggested for You</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {recommendations.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => onSelect(item)}
                        className="flex-shrink-0 w-48 group cursor-pointer"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2 shadow-sm border border-slate-100">
                            <img
                                src={item.image || (item.images && item.images[0]) || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                <span className="text-[9px] font-bold text-white uppercase tracking-tighter bg-black/20 backdrop-blur-md px-1.5 py-0.5 rounded">
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-0.5 text-yellow-400">
                                    <Star className="h-2.5 w-2.5 fill-current" />
                                    <span className="text-[10px] font-bold text-white">{item.ratingAvg || 0}</span>
                                </div>
                            </div>
                        </div>
                        <h4 className="text-xs font-bold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            <span>{item.district}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
