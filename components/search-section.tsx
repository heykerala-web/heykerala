"use client"

import { useState } from "react"
import { Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchSection() {
  const [searchData, setSearchData] = useState({
    destination: "",
    category: "all",
    date: "",
    guests: "1",
  })

  return (
    <section className="-mt-20 relative z-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mx-4">
        <h3 className="font-poppins text-2xl font-semibold text-center mb-6">Find Your Perfect Kerala Experience</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Where to go?"
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-kerala-green"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={searchData.category}
              onChange={(e) => setSearchData({ ...searchData, category: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-kerala-green focus:outline-none bg-white"
            >
              <option value="all">All Categories</option>
              <option value="attractions">Attractions</option>
              <option value="hotels">Hotels</option>
              <option value="restaurants">Restaurants</option>
              <option value="events">Events</option>
            </select>
          </div>

          {/* Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-kerala-green"
            />
          </div>

          {/* Search Button */}
          <Button className="h-12 bg-kerala-green hover:bg-kerala-green/90 text-white rounded-xl font-semibold">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Popular:</span>
          {["Munnar", "Alleppey", "Kochi", "Kovalam", "Wayanad"].map((place) => (
            <button
              key={place}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-kerala-green hover:text-white rounded-full transition-colors"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
