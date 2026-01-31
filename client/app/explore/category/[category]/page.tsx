"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { PlaceCard } from "@/components/place-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
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
            <div className="bg-emerald-800 text-white pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    <Link href="/where-to-go" className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
                        Explore {category === 'Waterfalls' ? 'Waterfalls' : category + (category.endsWith('s') ? '' : 's')} in Kerala
                    </h1>
                    <p className="text-emerald-100 text-lg max-w-2xl">
                        Discover the best {category.toLowerCase()} destinations, curated just for you.
                    </p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="container mx-auto max-w-7xl px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder={`Search in ${category}...`}
                            className="pl-10 h-12 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Future: Add District Filter Dropdown here if needed */}
                </div>
            </div>

            {/* Results Grid */}
            <div className="container mx-auto max-w-7xl px-4 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    </div>
                ) : places.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {places.map((place) => (
                            <PlaceCard
                                key={place._id}
                                id={place._id}
                                name={place.name}
                                location={place.district}
                                image={place.image}
                                rating={place.ratingAvg || 0}
                                description={place.description}
                                category={place.category}
                            />
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
