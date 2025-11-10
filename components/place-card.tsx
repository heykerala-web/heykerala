"use client"

import { useState } from "react"
import { Star, MapPin, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PlaceCardProps {
  id: string
  name: string
  location: string
  image: string
  rating: number
  description: string
  category: string
  isBookmarked?: boolean
}

export function PlaceCard({
  id,
  name,
  location,
  image,
  rating,
  description,
  category,
  isBookmarked = false,
}: PlaceCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  return (
    <article className="rounded-xl bg-white shadow-md hover:shadow-lg overflow-hidden transition">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="h-48 w-full object-cover" />
        <span className="absolute left-3 top-3 inline-block rounded-full bg-emerald-600 text-white text-xs font-semibold px-2 py-1">
          {category}
        </span>
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

        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{description}</p>

        <Button size="sm" className="mt-4 w-full">
          <Eye className="mr-2 h-4 w-4" />
          View More
        </Button>
      </div>
    </article>
  )
}
