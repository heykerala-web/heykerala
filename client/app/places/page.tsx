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
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">Places in Kerala</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
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
                  className="pl-12 h-12 rounded-full border-gray-200 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4 rounded-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "rating" | "location")}
                  className="h-12 px-4 rounded-full border border-gray-200 focus:border-emerald-500 focus:outline-none bg-white"
                  aria-label="Sort by"
                  title="Sort by"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="location">Sort by Location</option>
                </select>
                <div className="flex rounded-full border border-gray-200 p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-emerald-600 text-white" : "text-gray-600"
                      }`}
                    aria-label="Grid view"
                    title="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-emerald-600 text-white" : "text-gray-600"
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "Place" : "Places"} Found
            </h2>
            <p className="text-gray-600">
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
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">{place.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                      {place.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-poppins font-semibold text-xl mb-2 line-clamp-1">{place.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                    {place.location}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{place.description}</p>
                  {place.highlights && place.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {place.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    View Details
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
                className="group bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full md:w-64 h-48 object-cover rounded-2xl flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-2">{place.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                        {place.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{place.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                        {place.category}
                      </span>
                      {place.highlights && place.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {place.highlights.slice(0, 2).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      View Details →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-poppins text-2xl font-bold mb-2">No places found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
