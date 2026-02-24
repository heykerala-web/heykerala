"use client"

import { useState } from "react"
import Link from "next/link"
import { hotels } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Filter, Grid, List, Map, IndianRupee } from "lucide-react"
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-3xl" />
});

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice =
      (!minPrice || hotel.price >= parseInt(minPrice)) &&
      (!maxPrice || hotel.price <= parseInt(maxPrice))
    const matchesRating = !minRating || hotel.rating >= parseFloat(minRating)
    return matchesSearch && matchesPrice && matchesRating
  })

  // Map markers
  const coords: Record<string, [number, number]> = {
    "Kumarakom": [9.6171, 76.4295],
    "Munnar": [10.0889, 77.0595],
    "Kovalam": [8.3667, 76.9833],
    "Fort Kochi": [9.9312, 76.2673],
  }

  const mapMarkers = filteredHotels.map((hotel) => {
    const locationKey = hotel.location.split(",")[0]
    const [lat, lng] = coords[locationKey] || [10.5276, 76.2144]
    return {
      lat,
      lng,
      title: hotel.name,
      description: hotel.location,
    }
  })

  const mapCenter: [number, number] =
    mapMarkers.length > 0 ? [mapMarkers[0].lat, mapMarkers[0].lng] : [10.5276, 76.2144]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4 text-white">Hotels & Resorts</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl text-white">
            Find comfortable stays for every budget and taste across Kerala
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search hotels, locations..."
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

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Min Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Max Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 focus:border-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setMinPrice("")
                      setMaxPrice("")
                      setMinRating("")
                    }}
                    variant="outline"
                    className="w-full h-10 rounded-lg"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-8 md:py-12">
        <div className="mb-6">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-2">
            {filteredHotels.length} {filteredHotels.length === 1 ? "Hotel" : "Hotels"} Found
          </h2>
        </div>

        {viewMode === "map" ? (
          <div className="space-y-6">
            <LeafletMap center={mapCenter} zoom={8} markers={mapMarkers} height="600px" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.id}`}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-poppins font-semibold text-lg mb-2 line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                      {hotel.location}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <IndianRupee className="h-4 w-4" />
                        <span>{hotel.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                      View Details
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.id}`}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span>{hotel.price.toLocaleString()}/night</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-poppins font-semibold text-xl mb-2 line-clamp-1">{hotel.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                    {hotel.location}
                  </div>
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                        >
                          {amenity}
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
            {filteredHotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.id}`}
                className="group bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full md:w-64 h-48 object-cover rounded-2xl flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-2">{hotel.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                        {hotel.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm mb-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{hotel.rating}</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        <span>{hotel.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 font-normal">/night</span>
                      </div>
                    </div>
                  </div>
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    View Details →
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredHotels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="font-poppins text-2xl font-bold mb-2">No hotels found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setMinPrice("")
                setMaxPrice("")
                setMinRating("")
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

