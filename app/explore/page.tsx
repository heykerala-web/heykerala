"use client"

import { useState } from "react"
import { Search, MapPin, Star, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { places } from "@/lib/data"

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || place.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-200 focus:border-kerala-green focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="hill station">Hill Stations</option>
                <option value="beach">Beaches</option>
                <option value="backwaters">Backwaters</option>
                <option value="wildlife">Wildlife</option>
              </select>

              <div className="flex rounded-full border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full ${viewMode === "grid" ? "bg-kerala-green text-white" : "text-gray-600"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full ${viewMode === "list" ? "bg-kerala-green text-white" : "text-gray-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold mb-2">Explore Kerala ({filteredPlaces.length} places)</h1>
          <p className="text-gray-600">Discover amazing destinations across God&apos;s Own Country</p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-poppins font-semibold text-lg line-clamp-1">{place.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{place.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {place.location}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{place.description}</p>
                  <Button className="w-full bg-kerala-green hover:bg-kerala-green/90">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-2xl shadow-lg p-6 flex gap-6">
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-poppins font-semibold text-xl">{place.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{place.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {place.location}
                  </div>
                  <p className="text-gray-600 mb-4">{place.description}</p>
                  <Button className="bg-kerala-green hover:bg-kerala-green/90">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
