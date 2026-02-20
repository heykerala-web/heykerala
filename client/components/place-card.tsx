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
import { getTourismImage } from "@/lib/images"

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
    <Link href={`/places/${id}`} className="block group h-full">
      <div className="relative h-full flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={image || getTourismImage(name, category)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {category}
            </span>
          </div>

          <button
            aria-label={`${bookmarked ? "Remove from" : "Add to"} bookmarks`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setBookmarked((b) => !b)
            }}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-red-500 transition-all z-20 group/heart"
          >
            <Heart className={`h-4 w-4 ${bookmarked ? "fill-red-500 text-red-500" : "fill-transparent"}`} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow bg-white">
          <div className="mb-3">
            <h3 className="text-xl font-outfit font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary/60" />
              <span className="text-xs font-medium">{location}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          <Button className="w-full rounded-xl font-bold group-hover:bg-primary group-hover:text-white transition-all shadow-none group-hover:shadow-lg group-hover:shadow-primary/20">
            Explore Details <Eye className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}
