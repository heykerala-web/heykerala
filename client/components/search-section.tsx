"use client"

import { useState } from "react"
import { Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { SearchSuggestions } from "@/components/ui/search-suggestions"
import { useRouter } from "next/navigation"

export function SearchSection() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    destination: "",
    category: "all",
    date: "",
    guests: "1",
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchData.destination) params.set("q", searchData.destination)
    if (searchData.category && searchData.category !== "all") params.set("category", searchData.category)
    if (searchData.date) params.set("date", searchData.date)
    router.push(`/search?${params.toString()}`)
  }

  const handlePopularClick = (place: string) => {
    setSearchData(prev => ({ ...prev, destination: place }))
  }

  return (
    <section className="-mt-24 relative z-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-5xl mx-auto border border-gray-100">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-800">
            Find Your Perfect Kerala Experience
          </h3>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Destination Input Group */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors z-10">
                <MapPin className="h-5 w-5" />
              </div>
              <Input
                placeholder="Where to go?"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-base"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute top-full left-0 right-0 pt-2 z-50">
                <SearchSuggestions query={searchData.destination} />
              </div>
            </div>

            {/* Category Select */}
            <div className="lg:w-64 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors z-10">
                <Search className="h-5 w-5" />
              </div>
              <select
                value={searchData.category}
                onChange={(e) => setSearchData({ ...searchData, category: e.target.value })}
                className="w-full h-14 pl-12 pr-10 rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-base appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Hill Station">Hill Stations</option>
                <option value="Beach">Beaches</option>
                <option value="Backwaters">Backwaters</option>
                <option value="Wildlife">Wildlife</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Date Picker */}
            <div className="lg:w-56 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors z-10">
                <Calendar className="h-5 w-5" />
              </div>
              <Input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-base text-gray-600 cursor-pointer"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all active:scale-95"
            >
              Search
            </Button>
          </div>

          {/* Quick Filters / Popular */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Popular:</span>
            <div className="flex flex-wrap gap-2">
              {["Munnar", "Alleppey", "Kochi", "Kovalam", "Wayanad"].map((place) => (
                <button
                  key={place}
                  onClick={() => handlePopularClick(place)}
                  className="px-4 py-1.5 text-sm bg-gray-50 text-gray-600 border border-gray-100 rounded-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
