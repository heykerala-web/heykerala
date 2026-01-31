"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Grid, List, Map, X, Calendar, IndianRupee } from "lucide-react"
import LeafletMap from "@/app/components/Map/LeafletMap"

const SearchContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [selectedType, setSelectedType] = useState(searchParams.get("category") || "all")

  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Sync local state with URL params
    setSearchTerm(searchParams.get("q") || "")
    setSelectedType(searchParams.get("category") || "all")
  }, [searchParams])

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        const q = searchParams.get("q") || searchTerm
        const c = searchParams.get("category") || selectedType

        if (q) params.set("search", q)
        if (c && c !== "all") params.set("category", c)

        const res = await fetch(`http://localhost:5000/api/places?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setPlaces(data.data)
        } else {
          setError(data.message || "Failed to fetch results")
        }
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [searchParams]) // Re-fetch when URL params change

  const handleSearch = (term: string, type: string) => {
    const params = new URLSearchParams()
    if (term) params.set("q", term)
    if (type && type !== "all") params.set("category", type)
    router.push(`/search?${params.toString()}`)
  }

  // Map markers
  const mapMarkers = places
    .filter((item) => item.location || (item.latitude && item.longitude))
    .map((item) => {
      return {
        lat: item.latitude || 10.5276,
        lng: item.longitude || 76.2144,
        title: item.name,
        description: item.location,
      }
    })

  const mapCenter: [number, number] =
    mapMarkers.length > 0 ? [mapMarkers[0].lat, mapMarkers[0].lng] : [10.5276, 76.2144]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">Search Kerala</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Find places, hotels, events, and experiences across God&apos;s Own Country
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search places..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm, selectedType)}
                  className="pl-12 pr-4 h-12 rounded-full border-gray-200 focus:border-emerald-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      handleSearch("", selectedType)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value)
                    handleSearch(searchTerm, e.target.value)
                  }}
                  className="h-12 px-4 rounded-full border border-gray-200 focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="Hill Station">Hill Stations</option>
                  <option value="Beach">Beaches</option>
                  <option value="Backwaters">Backwaters</option>
                  <option value="Wildlife">Wildlife</option>
                </select>
                <div className="flex rounded-full border border-gray-200 p-1 bg-gray-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-emerald-600 text-white" : "text-gray-600"
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-emerald-600 text-white" : "text-gray-600"
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-full transition-all ${viewMode === "map" ? "bg-emerald-600 text-white" : "text-gray-600"
                      }`}
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-8 md:py-12">
        <div className="mb-6">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">
            {places.length} {places.length === 1 ? "Result" : "Results"} Found
          </h2>
          {searchTerm && <p className="text-gray-600">Search results for &quot;{searchTerm}&quot;</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : viewMode === "map" ? (
          <div className="space-y-6">
            <LeafletMap center={mapCenter} zoom={8} markers={mapMarkers} height="600px" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((item) => (
                <Link
                  key={item._id}
                  href={`/places/${item._id}`}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <img
                    src={item.image || (item.images && item.images[0]) || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {item.category}
                      </span>
                      {item.ratingAvg > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{item.ratingAvg}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.district}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((item) => (
              <Link
                key={item._id}
                href={`/places/${item._id}`}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || (item.images && item.images[0]) || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white">
                      {item.category}
                    </span>
                  </div>
                  {item.ratingAvg > 0 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-800">{item.ratingAvg}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-poppins font-semibold text-xl mb-2 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                    {item.location}
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
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
            {places.map((item) => (
              <Link
                key={item._id}
                href={`/places/${item._id}`}
                className="group bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all"
              >
                <img
                  src={item.image || (item.images && item.images[0]) || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full md:w-64 h-48 object-cover rounded-2xl flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {item.category}
                        </span>
                        {item.ratingAvg > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-sm">{item.ratingAvg}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-2">{item.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      View Details →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {places.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-poppins text-2xl font-bold mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
            <Button onClick={() => handleSearch("", "all")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  )
}
