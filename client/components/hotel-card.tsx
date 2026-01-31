"use client"

import { useState } from "react"
import { Star, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface HotelCardProps {
  id: string
  name: string
  location: string
  image: string
  rating: number
  price: number
  amenities: string[]
  isBookmarked?: boolean
}

export function HotelCard({
  id,
  name,
  location,
  image,
  rating,
  price,
  amenities,
  isBookmarked = false,
}: HotelCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  return (
    <article className="rounded-xl bg-white shadow-md hover:shadow-lg overflow-hidden transition">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="h-48 w-full object-cover" />
        <button
          aria-label={`${bookmarked ? "Remove from" : "Add to"} bookmarks`}
          onClick={() => setBookmarked((b) => !b)}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 hover:bg-white transition"
        >
          <Heart className={`h-4 w-4 ${bookmarked ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center text-gray-600">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{price}</span>
            <span className="ml-1 text-sm text-gray-600">/night</span>
          </div>
          <Button>Book Now</Button>
        </div>
      </div>
    </article>
  )
}
