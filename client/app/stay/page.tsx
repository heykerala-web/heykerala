"use client";

import { useEffect, useState } from "react";
import { stayService, Stay, StayParams } from "@/services/stayService";
import { StayCard } from "@/components/StayCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Search, SlidersHorizontal, MapPin, X, ArrowRight } from "lucide-react";
import {
    FloatingFilterWrapper,
    FilterItem,
    FilterInput,
    FilterSelect,
    FilterButton
} from "@/components/shared/FloatingFilter";

export default function StayPage() {
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<StayParams>({});
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchStays = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await stayService.getAll({ ...filters, search });
            if (response && response.success) {
                setStays(response.data);
            } else {
                setStays([]);
                setError(response?.message || "Failed to load stays");
            }
        } catch (error: any) {
            console.error("Failed to fetch stays", error);
            setStays([]);
            setError("Connection error. Please check if the database is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStays();
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStays();
    };

    const clearFilters = () => {
        setSearch("");
        setFilters({});
    };

    const isFiltered = search !== "" || Object.keys(filters).length > 0;

    return (
        <div className="min-h-screen bg-white">
            {/* 🔹 CINEMATIC HERO BANNER */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                        alt="Luxury Stays"
                        className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                    <span className="px-6 py-2 bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-[0.4em] mb-8 animate-fade-in-up">
                        Handpicked Collections
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 drop-shadow-2xl animate-fade-in-up">
                        Elite <br /><span className="text-emerald-400">Sanctuaries</span>
                    </h1>
                    <p className="text-white text-lg md:text-xl max-w-2xl font-medium animate-fade-in-up delay-100">
                        Discover Kerala's most exclusive retreats, from colonial heritage bungalows to floating glass villas.
                    </p>
                </div>
            </div>

            {/* 🔹 FLOATING SEARCH & FILTERS */}
            <FloatingFilterWrapper>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    {/* Search Input */}
                    <div className="md:col-span-12 lg:col-span-5">
                        <FilterItem label="Where to find peace?">
                            <FilterInput
                                icon={<Search className="h-5 w-5" />}
                                placeholder="Search by name, district, or landmark..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </FilterItem>
                    </div>

                    {/* Listing Type Filter */}
                    <div className="md:col-span-6 lg:col-span-3">
                        <FilterItem label="Stay Type">
                            <FilterSelect
                                value={filters.type || "all"}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value === 'all' ? undefined : e.target.value as any })}
                            >
                                <option value="all">All Categories</option>
                                <option value="hotel">Boutique Hotels</option>
                                <option value="resort">Luxury Resorts</option>
                                <option value="homestay">Elite Homestays</option>
                                <option value="restaurant">Fine Dining</option>
                                <option value="cafe">Design Cafes</option>
                            </FilterSelect>
                        </FilterItem>
                    </div>

                    {/* District Filter */}
                    <div className="md:col-span-6 lg:col-span-3">
                        <FilterItem label="Location">
                            <FilterSelect
                                icon={<MapPin className="h-5 w-5" />}
                                value={filters.district || "all"}
                                onChange={(e) => setFilters({ ...filters, district: e.target.value === 'all' ? undefined : e.target.value })}
                            >
                                <option value="all">Kerala (All Districts)</option>
                                <option value="Idukki">Idukki (Munnar)</option>
                                <option value="Alappuzha">Alappuzha (Backwaters)</option>
                                <option value="Wayanad">Wayanad (Forests)</option>
                                <option value="Ernakulam">Ernakulam (City)</option>
                            </FilterSelect>
                        </FilterItem>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-12 lg:col-span-1">
                        <FilterButton type="submit">
                            <ArrowRight className="h-5 w-5" />
                        </FilterButton>
                    </div>
                </form>

                {isFiltered && (
                    <div className="mt-6 flex items-center gap-3 animate-fade-in-up">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Filters:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 rounded-full border border-gray-100 text-emerald-600 hover:text-white hover:bg-emerald-600 px-4 font-bold text-[10px] uppercase tracking-widest"
                        >
                            Clear All <X className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                )}
            </FloatingFilterWrapper>

            <div className="container mx-auto px-6 py-24 lg:py-32">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-6">
                        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Curating your selection...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="bg-rose-50 border border-rose-100 p-12 rounded-[3.5rem] shadow-sm inline-block max-w-xl">
                            <h2 className="text-3xl font-black text-rose-900 mb-4 tracking-tighter">Connection Interrupted</h2>
                            <p className="text-rose-600/80 font-medium mb-10 leading-relaxed text-lg">{error}</p>
                            <Button variant="outline" className="h-16 px-10 rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-100 font-black uppercase tracking-widest text-xs" onClick={fetchStays}>Reconnect to Database</Button>
                        </div>
                    </div>
                ) : stays.length > 0 ? (
                    <div className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mr-6">
                            <div>
                                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                                    Available <span className="text-emerald-600">Retreats</span>
                                </h2>
                                <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Showing {stays.length} verified listings in Kerala</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="rounded-2xl h-14 px-6 border-gray-100 font-bold text-xs uppercase tracking-widest">
                                    <SlidersHorizontal className="h-4 w-4 mr-2" /> More Filters
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in-up">
                            {stays.map((stay) => (
                                <StayCard
                                    key={stay._id}
                                    id={stay._id}
                                    name={stay.name}
                                    type={stay.type}
                                    district={stay.district}
                                    image={stay.images[0]}
                                    rating={stay.ratingAvg}
                                    price={stay.price}
                                    amenities={stay.amenities}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="bg-gray-50 p-20 rounded-[4rem] shadow-sm inline-block max-w-2xl border border-gray-100">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200">
                                <Search className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">No Sanctuaries Found</h3>
                            <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed">We couldn't find any stays matching your current filters. Experience tells us that adjusting your selection might reveal hidden gems.</p>
                            <Button className="h-16 px-10 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest text-xs" onClick={clearFilters}>Reset All Explorations</Button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
