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
        <div className="flex h-full bg-white relative">
            {/* Left Panel: List & Filters (Hidden on mobile if map view is active) */}
            <div className={`${view === "map" ? "hidden md:flex" : "flex"} w-full md:w-[450px] lg:w-[500px] flex-col border-r h-full z-10 bg-white shadow-xl`}>

                {/* Header: Search & Tabs */}
                <div className="p-4 border-b space-y-4 bg-white z-20">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search places..."
                                className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                        </div>
                        {/* District Filter Dropdown */}
                        <div className="relative w-1/3 min-w-[120px]">
                            <select
                                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/5"
                                value={filters.district}
                                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                            >
                                <option value="all">All Kerala</option>
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
                            </select>
                        </div>
                    </div>

                    <Tabs value={filters.type} onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))} className="w-full">
                        <TabsList className="w-full flex justify-start overflow-x-auto scrollbar-hide h-12 bg-transparent gap-2 p-0">
                            {["ThingsToDo", "Locations", "Restaurants", "Stays"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-full border border-gray-200 px-6 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black transition-all whitespace-nowrap"
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
