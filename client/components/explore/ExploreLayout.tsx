"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ExploreList } from "./ExploreList";
import { PlaceDetailPanel } from "./PlaceDetailPanel";
import { Search, Filter, Map as MapIcon, List, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { placeService } from "@/services/placeService";
import { FilterInput, FilterSelect } from "@/components/shared/FloatingFilter";
import { API_URL } from "@/lib/api";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

import { ExploreRecommendations } from "./ExploreRecommendations";

// Dynamically import Map to avoid SSR issues with Leaflet
const ExploreMap = dynamic(() => import("./ExploreMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function ExploreLayout() {
    const { user, updateUser } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [view, setView] = useState<"map" | "list">("map"); // Mobile view toggle
    const [isSmartSearch, setIsSmartSearch] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        type: "ThingsToDo", // Default tab
        category: "all",
        district: "all",
        budget: "all",
        minRating: "all"
    });

    // Check if selected place is already in favorites
    useEffect(() => {
        if (selectedPlace && user) {
            const isSaved = user.savedPlaces?.some((p: any) => {
                const savedId = typeof p === 'string' ? p : p._id;
                return savedId === selectedPlace._id;
            });
            setIsFavorite(!!isSaved);
        } else {
            setIsFavorite(false);
        }
    }, [selectedPlace, user]);

    // Fetch places when filters change
    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                let data: any;

                if (isSmartSearch && filters.search.length > 2) {
                    // Use Semantic Search
                    const response = await fetch(`${API_URL}/ai/search?q=${encodeURIComponent(filters.search)}`);
                    const result = await response.json();
                    data = { success: true, data: result };
                } else {
                    // Use regular search
                    const params: any = {};
                    if (filters.search) params.search = filters.search;
                    if (filters.type) params.type = filters.type;
                    if (filters.category !== "all") params.category = filters.category;
                    if (filters.district !== "all") params.district = filters.district;
                    if (filters.budget !== "all") params.budget = filters.budget;
                    if (filters.minRating !== "all") params.minRating = filters.minRating;
                    params.limit = 50;

                    const res = await placeService.getAll(params);
                    data = res;
                }

                if (data.success) {
                    setPlaces(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch places:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPlaces();
        }, 300); // 300ms Debounce

        return () => clearTimeout(timer);
    }, [filters, isSmartSearch]);

    const handleToggleSave = async () => {
        if (!user) {
            toast.error("Please login to save places");
            return;
        }

        if (!selectedPlace) return;

        const placeId = selectedPlace._id;

        try {
            if (isFavorite) {
                await api.delete(`/users/save/place/${placeId}`);
                toast.success("Removed from saved places");
                const newSaved = user.savedPlaces?.filter((p: any) => {
                    const savedId = typeof p === 'string' ? p : p._id;
                    return savedId !== placeId;
                });
                updateUser({ savedPlaces: newSaved });
            } else {
                await api.post(`/users/save/place/${placeId}`);
                toast.success("Added to saved places");
                const newSaved = [...(user.savedPlaces || []), placeId];
                updateUser({ savedPlaces: newSaved });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Failed to update saved places:", error);
            toast.error("Failed to update saved places");
        }
    };

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Left Panel: List & Filters & Details */}
            <div className={`${view === "map" ? "hidden md:flex" : "flex"} w-full md:w-[450px] lg:w-[480px] flex-col h-full z-10 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.05)] relative`}>

                {!selectedPlace ? (
                    <div className="flex flex-col h-full animate-in fade-in duration-300">
                        {/* Header: Search & Tabs */}
                        <div className="p-6 border-b border-white/20 space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <FilterInput
                                            icon={<Search className="h-5 w-5" />}
                                            placeholder={isSmartSearch ? "Ask AI: 'Best place for kids'..." : "Search destinations..."}
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                            className={`h-14 bg-muted/50 border-transparent transition-all ${isSmartSearch ? 'ring-2 ring-primary/20 border-primary bg-primary/5' : 'focus:bg-white focus:border-emerald-500/20'}`}
                                        />
                                    </div>
                                    <Button
                                        variant={isSmartSearch ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setIsSmartSearch(!isSmartSearch)}
                                        className={cn(
                                            "h-14 w-14 rounded-2xl shrink-0 transition-all",
                                            isSmartSearch ? "bg-primary shadow-lg shadow-primary/20 scale-105" : "bg-muted/30 border-transparent hover:bg-muted"
                                        )}
                                        title={isSmartSearch ? "Smart Search Active" : "Enable AI Smart Search"}
                                    >
                                        <Sparkles className={cn("h-6 w-6", isSmartSearch ? "text-primary-foreground animate-pulse" : "text-muted-foreground")} />
                                    </Button>
                                </div>

                                {/* Filters Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <FilterSelect
                                        icon={<Filter className="h-4 w-4" />}
                                        value={filters.district}
                                        onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                                        className="h-12 bg-muted/50 border-transparent text-sm"
                                    >
                                        <option value="all">District (All)</option>
                                        <option value="Idukki">Idukki</option>
                                        <option value="Alappuzha">Alappuzha</option>
                                        <option value="Wayanad">Wayanad</option>
                                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                                        <option value="Ernakulam">Ernakulam</option>
                                        <option value="Kozhikode">Kozhikode</option>
                                        <option value="Kannur">Kannur</option>
                                        <option value="Kottayam">Kottayam</option>
                                        <option value="Thrissur">Thrissur</option>
                                        <option value="Palakkad">Palakkad</option>
                                        <option value="Malappuram">Malappuram</option>
                                        <option value="Kollam">Kollam</option>
                                        <option value="Pathanamthitta">Pathanamthitta</option>
                                        <option value="Kasaragod">Kasaragod</option>
                                    </FilterSelect>

                                    <FilterSelect
                                        value={filters.budget}
                                        onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                                        className="h-12 bg-muted/50 border-transparent text-sm px-4"
                                    >
                                        <option value="all">Budget (Any)</option>
                                        <option value="Low">Low / Free</option>
                                        <option value="Mid">Mid-Range</option>
                                        <option value="High">Luxury</option>
                                    </FilterSelect>
                                </div>

                                {/* Rating Filter (Full Width for visibility) */}
                                <FilterSelect
                                    value={filters.minRating}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                                    className="h-12 bg-muted/50 border-transparent text-sm px-4"
                                >
                                    <option value="all">Rating (Any)</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="4.5">4.5+ Stars</option>
                                </FilterSelect>
                            </div>

                            <Tabs value={filters.type} onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))} className="w-full">
                                <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-hide h-auto bg-transparent gap-3 p-0">
                                    {["ThingsToDo", "Locations", "Restaurants", "Stays"].map((tab) => (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className="rounded-full border border-muted px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all whitespace-nowrap text-xs font-semibold uppercase tracking-wider"
                                        >
                                            {tab === "ThingsToDo" ? "Things to do" : tab}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Results List */}
                        <div className="flex-1 overflow-y-auto p-4 content-start relative">
                            <ExploreRecommendations
                                onSelect={(place) => setSelectedPlace(place)}
                            />

                            <div className="px-2 mb-2 flex items-center justify-between">
                                <h3 className="font-outfit font-bold text-sm tracking-tight text-slate-400 uppercase">Results</h3>
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{places.length} Places Found</span>
                            </div>

                            <ExploreList
                                places={places}
                                loading={loading}
                                onSelect={(place) => {
                                    setSelectedPlace(place);
                                }}
                                selectedId={selectedPlace?._id}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-full animate-in slide-in-from-left duration-300">
                        <PlaceDetailPanel
                            place={selectedPlace}
                            isFavorite={isFavorite}
                            onToggleSave={handleToggleSave}
                            onClose={() => setSelectedPlace(null)}
                        />
                    </div>
                )}
            </div>

            {/* Right Panel: Map */}
            <div className={`${view === "list" ? "hidden md:block" : "block"} flex-1 relative bg-gray-100`}>
                <ExploreMap
                    places={places}
                    selectedPlace={selectedPlace}
                    onSelect={(place: any) => {
                        setSelectedPlace(place);
                        // If on mobile map view, maybe show a small card or switch to list? 
                        // For now, user asked for "left side show location details", implying desktop.
                        // On mobile, doing this might be confusing if user can't see the list.
                        // Let's ensure desktop works first.
                        if (window.innerWidth < 768) {
                            setView("list");
                        }
                    }}
                />

                {/* Mobile Toggle Button */}
                <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
                    <Button
                        onClick={() => setView(view === "map" ? "list" : "map")}
                        className="rounded-full shadow-xl px-6 bg-black text-white hover:bg-gray-800"
                    >
                        {view === "map" ? <><List className="mr-2 h-4 w-4" /> Show List</> : <><MapIcon className="mr-2 h-4 w-4" /> Show Map</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
