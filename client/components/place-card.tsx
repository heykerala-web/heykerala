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

import Link from "next/link"

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
    <Link href={`/places/${id}`} className="block group">
      <article className="rounded-xl bg-white shadow-md hover:shadow-lg overflow-hidden transition h-full flex flex-col">
        <div className="relative">
          <img src={image || "/placeholder.svg"} alt={name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 inline-block rounded-full bg-emerald-600 text-white text-xs font-semibold px-2 py-1 z-10">
            {category}
          </span>
          <button
            aria-label={`${bookmarked ? "Remove from" : "Add to"} bookmarks`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setBookmarked((b) => !b)
            }}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2 hover:bg-white transition z-20"
          >
            <Heart className={`h-4 w-4 ${bookmarked ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center text-gray-600">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>

          <p className="mt-3 text-sm text-gray-700 line-clamp-2 flex-grow">{description}</p>

          <div className="mt-4 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            <Eye className="mr-2 h-4 w-4" />
            View More
          </div>
        </div>
      </article>
    </Link>
  )
}
