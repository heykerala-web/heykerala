"use client"

import { useState } from "react"
import { Star, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTourismImage } from "@/lib/images"

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
    <article className="rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2 group">
      <div className="relative h-52 overflow-hidden">
        <img src={image || getTourismImage(name, "hotel")} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <button
          aria-label={`${bookmarked ? "Remove from" : "Add to"} bookmarks`}
          onClick={() => setBookmarked((b) => !b)}
          className="absolute right-4 top-4 rounded-full bg-white/95 backdrop-blur-md p-2.5 hover:bg-white transition-all duration-300 shadow-sm border border-black/5 active:scale-90"
        >
          <Heart className={`h-4.5 w-4.5 ${bookmarked ? "text-red-500 fill-red-500" : "text-foreground"}`} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl font-outfit font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 bg-muted/80 backdrop-blur-md rounded-full px-3 py-1 shadow-sm border border-border">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center text-gray-600">
          <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{location}</span>
        </div>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Price Per Night</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">₹{price}</span>
              <span className="text-xs text-muted-foreground font-medium">/night</span>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95">Book Now</Button>
        </div>
      </div>
    </article>
  )
}
