"use client"

import { useState } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")

  const handleSearch = () => {
    // For now, just log. Later, wire to real search or route.
    console.log({ search, category, location })
  }

  return (
    <div className="rounded-2xl bg-white shadow-lg p-5 md:p-6 -mt-16 relative z-20">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations, hotels, events..."
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 px-4 pr-8 rounded-md border border-gray-200 bg-white min-w-[160px] text-gray-700"
          >
            <option value="all">All categories</option>
            <option value="beaches">Beaches</option>
            <option value="backwaters">Backwaters</option>
            <option value="hills">Hill Stations</option>
            <option value="temples">Temples</option>
            <option value="wildlife">Wildlife</option>
          </select>
          <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 px-4 pr-8 rounded-md border border-gray-200 bg-white min-w-[160px] text-gray-700"
          >
            <option value="all">All districts</option>
            <option value="kochi">Kochi</option>
            <option value="munnar">Munnar</option>
            <option value="alleppey">Alleppey</option>
            <option value="kovalam">Kovalam</option>
            <option value="wayanad">Wayanad</option>
          </select>
          <MapPin className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        <Button onClick={handleSearch} className="h-12 px-6">
          Search
        </Button>
      </div>
    </div>
  )
}
