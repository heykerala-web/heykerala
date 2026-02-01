"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ExploreList } from "./ExploreList";
import { PlaceDetailPanel } from "./PlaceDetailPanel";
import { Search, Filter, Map as MapIcon, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { placeService } from "@/services/placeService";
import { FilterInput, FilterSelect } from "@/components/shared/FloatingFilter";

// Dynamically import Map to avoid SSR issues with Leaflet
const ExploreMap = dynamic(() => import("./ExploreMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function ExploreLayout() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [view, setView] = useState<"map" | "list">("map"); // Mobile view toggle
    const [filters, setFilters] = useState({
        search: "",
        type: "ThingsToDo", // Default tab
        category: "all",
        district: "all"
    });

    // Fetch places when filters change
    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (filters.search) params.search = filters.search;
                if (filters.type) params.type = filters.type;
                if (filters.category !== "all") params.category = filters.category;
                if (filters.district !== "all") params.district = filters.district;
                params.limit = 50;

                const data = await placeService.getAll(params);

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
    }, [filters]);

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Left Panel: List & Filters */}
            <div className={`${view === "map" ? "hidden md:flex" : "flex"} w-full md:w-[450px] lg:w-[480px] flex-col h-full z-10 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.05)]`}>



                {/* Header: Search & Tabs */}
                <div className="p-6 border-b border-white/20 space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <FilterInput
                                icon={<Search className="h-5 w-5" />}
                                placeholder="Search destinations..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="h-14 bg-muted/50 border-transparent focus:bg-white focus:border-emerald-500/20"
                            />
                        </div>
                        {/* District Filter Dropdown */}
                        <div className="w-full">
                            <FilterSelect
                                icon={<Filter className="h-5 w-5" />}
                                value={filters.district}
                                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                                className="h-14 bg-muted/50 border-transparent focus:bg-white focus:border-emerald-500/20"
                            >
                                <option value="all">All of Kerala</option>
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
                        </div>
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
                <div className="flex-1 overflow-y-auto p-4 content-start">
                    <ExploreList
                        places={places}
                        loading={loading}
                        onSelect={(place) => {
                            setSelectedPlace(place);
                            // If mobile, checking list item might want to toggle to map? Maybe not.
                        }}
                        selectedId={selectedPlace?._id}
                    />
                </div>
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
