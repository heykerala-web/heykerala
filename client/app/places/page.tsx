"use client"

// Update imports
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import api from "@/services/api" // Import API
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Filter, Grid, List, Map, Loader2 } from "lucide-react"
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-3xl" />
});

import { getFullImageUrl } from "@/lib/images";
import PlaceCard from "@/components/places/PlaceCard";

// Define Interface
interface Place {
  _id: string; // MongoDB uses _id
  name: string;
  image?: string;
  images?: string[];
  district: string;
  location: string;
  category: string;
  description: string;
  ratingAvg: number;
  ratingCount: number;
  highlights?: string[];
  [key: string]: any;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "location">("name")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", "Hill Station", "Beach", "Backwaters", "Wildlife"]

  // FETCH PLACES
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get("/places?limit=12");
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch places", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort Logic (Client-side useMemo for performance)
  const filteredAndSorted = useMemo(() => {
    return places
      .filter((place) => {
        const matchesSearch =
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (place.description && place.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "location") return a.location.localeCompare(b.location);
        return 0;
      });
  }, [places, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
            <div className="h-12 w-64 bg-white/20 rounded-full animate-pulse mb-6" />
            <div className="h-6 w-96 bg-white/20 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} variant="place" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
          <h1 className="font-outfit text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">Places in Kerala</h1>
          <p className="text-xl opacity-90 max-w-2xl font-inter leading-relaxed text-white">
            Discover hill stations, backwaters, beaches, wildlife sanctuaries and more across God&apos;s Own Country
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search places, locations, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-border bg-muted/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-14 px-6 rounded-2xl border-border hover:bg-muted font-bold"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "rating" | "location")}
                  className="h-14 px-6 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none bg-muted/50 hover:bg-muted transition-all text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer"
                  aria-label="Sort by"
                  title="Sort by"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="location">Sort by Location</option>
                </select>
                <div className="flex rounded-2xl border border-border p-1.5 bg-muted/50 items-center">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                      }`}
                    aria-label="Grid view"
                    title="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                      }`}
                    aria-label="List view"
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "map" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                      }`}
                    aria-label="Map view"
                    title="Map view"
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent"
                      }`}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-2">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "Place" : "Places"} Found
            </h2>
            <p className="text-muted-foreground font-medium">
              {selectedCategory !== "all" && `Showing ${selectedCategory} destinations`}
              {selectedCategory === "all" && "All destinations in Kerala"}
            </p>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="space-y-6">
            <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
              <LeafletMap
                center={[10.5276, 76.2144]}
                zoom={7}
                markers={filteredAndSorted.map(p => ({
                  lat: p.latitude || 10,
                  lng: p.longitude || 76,
                  title: p.name,
                  description: p.location
                }))}
                height="600px"
              />
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((place) => (
              <PlaceCard
                key={place._id}
                place={{
                  ...place,
                  ratingAvg: place.ratingAvg || place.rating,
                  totalReviews: place.ratingCount || place.totalReviews || 0
                } as any}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSorted.map((place) => (
              <PlaceCard
                key={place._id}
                place={{
                  ...place,
                  ratingAvg: place.ratingAvg || place.rating,
                  totalReviews: place.ratingCount || place.totalReviews || 0
                } as any}
                viewMode="list"
              />
            ))}
          </div>
        )}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-24 bg-card rounded-[3rem] border border-dashed border-border">
            <div className="text-7xl mb-6 opacity-40">🌊</div>
            <h3 className="font-outfit text-3xl font-bold mb-3 text-foreground">No places found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">We couldn&apos;t find anything matching your search. Why not try exploring all categories?</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
