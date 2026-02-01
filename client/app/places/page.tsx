"use client"

// Update imports
import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/services/api" // Import API
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Filter, Grid, List, Loader2 } from "lucide-react"

// Define Interface
interface Place {
  _id: string; // MongoDB uses _id
  name: string;
  image: string;
  location: string;
  rating: number; // or ratingAvg
  category: string;
  description: string;
  highlights?: string[];
  [key: string]: any;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "location">("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", "Hill Station", "Beach", "Backwaters", "Wildlife"]

  // FETCH PLACES
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get("/places?limit=100"); // Fetch all for client-side filtering or implement server-side
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch places", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort Logic (Client-side for now to keep it responsive)
  const filteredAndSorted = places
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/kerala-pattern.png')] bg-repeat" />
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
          <h1 className="font-outfit text-5xl md:text-6xl font-bold mb-6 tracking-tight">Places in Kerala</h1>
          <p className="text-xl opacity-90 max-w-2xl font-inter leading-relaxed">
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

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((place) => (
              <Link
                key={place._id}
                href={`/places/${place._id}`}
                className="group bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm border border-black/5">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="text-sm font-bold text-foreground">{place.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/95 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                      {place.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-outfit font-bold text-2xl mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors">{place.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm font-medium mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    {place.location}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed font-inter">{place.description}</p>
                  {place.highlights && place.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {place.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/10"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95">
                    Explore Now
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSorted.map((place) => (
              <Link
                key={place._id}
                href={`/places/${place._id}`}
                className="group bg-card rounded-[2.5rem] border border-border p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full md:w-64 h-48 object-cover rounded-2xl flex-shrink-0"
                />
                <div className="flex-1 flex flex-col py-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-outfit font-bold text-2xl md:text-4xl mb-2 text-foreground group-hover:text-primary transition-colors">{place.name}</h3>
                      <div className="flex items-center text-muted-foreground font-medium">
                        <MapPin className="h-5 w-5 mr-1 text-primary" />
                        {place.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/80 backdrop-blur-md rounded-full px-4 py-2 border border-border shadow-sm">
                      <Star className="h-5 w-5 text-accent fill-accent" />
                      <span className="font-bold text-lg">{place.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed font-inter">{place.description}</p>
                  <div className="mt-auto flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border border-primary/20">
                        {place.category}
                      </span>
                      {place.highlights && place.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {place.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-full border border-border"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95">
                      Explore Destiny →
                    </Button>
                  </div>
                </div>
              </Link>
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
