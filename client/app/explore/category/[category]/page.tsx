"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { PlaceCard } from "@/components/place-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Loader2, MapPin, Star } from "lucide-react";
import Link from "next/link";


// Simple debounce effect if hook doesn't exist
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface Place {
    _id: string;
    name: string;
    description: string;
    category: string;
    district: string;
    image: string;
    ratingAvg: number;
}

export default function CategoryExplorePage() {
    const params = useParams();
    const router = useRouter();

    // Handle potentially encoded category
    const rawCategory = params.category as string;
    const category = decodeURIComponent(rawCategory);

    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounceValue(searchTerm, 500);

    useEffect(() => {
        fetchPlaces();
    }, [category, debouncedSearch]);

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const response = await api.get("/places", {
                params: {
                    category: category,
                    search: debouncedSearch,
                    limit: 50 // Fetch enough to show
                }
            });
            if (response.data.success) {
                setPlaces(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch places", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-primary text-white pt-24 pb-16 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-6 relative z-10">
                    <Link href="/where-to-go" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-all group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-outfit font-bold uppercase tracking-widest text-xs">Back to Categories</span>
                    </Link>
                    <h1 className="text-4xl md:text-7xl font-bold font-outfit mb-6 tracking-tight text-white">
                        Explore {category === 'Waterfalls' ? 'Waterfalls' : category + (category.endsWith('s') ? '' : 's')}
                    </h1>
                    <p className="text-white/80 text-xl max-w-2xl font-inter font-light leading-relaxed">
                        Discover the most breathtaking {category.toLowerCase()} destinations in Kerala, handpicked for your next adventure.
                    </p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="container mx-auto max-w-7xl px-6 -mt-10 relative z-20">
                <div className="bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/20 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder={`Search in ${category}...`}
                            className="pl-12 h-14 text-lg rounded-2xl border-border bg-muted/30 focus:bg-white focus:border-primary/20 transition-all font-inter"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="container mx-auto max-w-7xl px-4 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    </div>
                ) : places.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        {places.map((place) => (
                            <Link
                                key={place._id}
                                href={`/places/${place._id}`}
                                className="group bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 flex flex-col shadow-sm"
                            >
                                <div className="relative overflow-hidden aspect-[4/3]">
                                    <img
                                        src={place.image || "/placeholder.svg"}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary/95 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border border-white/20">
                                            {place.category}
                                        </span>
                                    </div>
                                    {place.ratingAvg > 0 && (
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm border border-black/5">
                                            <Star className="h-4 w-4 text-accent fill-accent" />
                                            <span className="text-sm font-bold text-foreground">{place.ratingAvg}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-outfit font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">{place.name}</h3>
                                    <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                        {place.district}
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-inter font-light flex-1">{place.description}</p>
                                    <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl h-10 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all">
                                        Explore
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏝️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No places found</h3>
                        <p className="text-gray-500">
                            We couldn't find any places in "{category}" matching your search.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => { setSearchTerm(""); fetchPlaces(); }}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
