"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, Grid, List, Map, X, Calendar, IndianRupee, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), { ssr: false })

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
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/kerala-pattern.png')] bg-repeat" />
        <div className="relative container mx-auto px-6 max-w-7xl z-10">
          <h1 className="font-outfit text-4xl md:text-6xl font-bold mb-4 tracking-tight">Search Kerala</h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl font-inter font-light">
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
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm, selectedType)}
                  className="pl-12 pr-4 h-14 rounded-2xl border-border bg-muted/30 focus:bg-white focus:border-primary/20 transition-all font-inter"
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
                    className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-xl transition-all ${viewMode === "map" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
          <h2 className="font-outfit text-3xl font-bold mb-2 text-foreground">
            {places.length} {places.length === 1 ? "Result" : "Results"} Found
          </h2>
          {searchTerm && <p className="text-gray-600">Search results for &quot;{searchTerm}&quot;</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
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
                    src={item.images?.[0] || item.image || "/placeholder.svg"}
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
                className="group bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 flex flex-col shadow-sm"
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={item.images?.[0] || item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/95 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border border-white/20">
                      {item.category}
                    </span>
                  </div>
                  {item.ratingAvg > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm border border-black/5">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-bold text-foreground">{item.ratingAvg}</span>
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-outfit font-bold text-2xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4">
                    <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                    {item.location}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-inter font-light leading-relaxed">{item.description}</p>
                  )}
                  <div className="mt-auto">
                    <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                      View Details
                    </Button>
                  </div>
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
                className="group bg-card rounded-[2rem] border border-border p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 overflow-hidden shadow-sm"
              >
                <div className="relative w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-[1.5rem] shadow-inner">
                  <img
                    src={item.images?.[0] || item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                          {item.category}
                        </span>
                        {item.ratingAvg > 0 && (
                          <div className="flex items-center gap-1.5 bg-muted/80 backdrop-blur-md rounded-full px-3 py-1 shadow-sm border border-border">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="font-bold text-foreground text-sm">{item.ratingAvg}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-outfit font-bold text-2xl md:text-3xl mb-1 text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                      <div className="flex items-center text-muted-foreground font-medium text-sm">
                        <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground mb-6 line-clamp-2 text-sm leading-relaxed font-inter font-light">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <Button className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl px-8 h-10 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all">
                      View Details
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
