"use client"

import React, { useState, useEffect } from "react"
import { Star, MapPin, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getFullImageUrl } from "@/lib/images"
import { useAuth } from "@/context/AuthContext"
import api from "@/services/api"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { trackPlaceView } from "@/lib/interactionTracker"

export interface PlaceCardProps {
  id: string
  name: string
  location: string
  image: string
  rating: number
  description: string
  category: string
  images?: string[]
  type?: string       // optional: 'place' or 'event'
  district?: string   // optional: used for interaction tracking
  tags?: string[]     // optional: used for interaction tracking
  isBookmarked?: boolean
  updatedAt?: string | Date
}

export const PlaceCard = React.memo(function PlaceCard({
  id,
  name,
  location,
  image,
  rating,
  description,
  category,
  images = [],
  type = 'place',
  district = "",
  tags = [],
  isBookmarked = false,
  updatedAt,
}: PlaceCardProps) {
  const { user, updateUser } = useAuth()
  const router = useRouter()

  // Use user state to determine if bookmarked if available
  const isSaved = user?.savedPlaces?.some((p: any) => {
    const savedId = typeof p === 'string' ? p : p._id;
    return savedId === id;
  }) ?? isBookmarked;

  const [bookmarked, setBookmarked] = useState(isSaved)

  // Sync with user state if it changes
  useEffect(() => {
    setBookmarked(isSaved);
  }, [isSaved]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please login to save places");
      router.push("/login");
      return;
    }

    try {
      if (bookmarked) {
        await api.delete(`/users/save/place/${id}`);
        toast.success("Removed from saved places");
        const newSaved = user.savedPlaces?.filter((p: any) => {
          const savedId = typeof p === 'string' ? p : p._id;
          return savedId !== id;
        });
        updateUser({ savedPlaces: newSaved });
      } else {
        await api.post(`/users/save/place/${id}`);
        toast.success("Added to saved places");
        const newSaved = [...(user.savedPlaces || []), id];
        updateUser({ savedPlaces: newSaved });
      }
      setBookmarked(!bookmarked)
    } catch (error) {
      console.error("Failed to update saved places:", error);
      toast.error("Failed to update saved places");
    }
  }

  return (
    <Link
      href={type === 'event' ? `/events/${id}` : `/places/${id}`}
      className="block group h-full"
      // Track this place view for the recommendation engine (fire-and-forget)
      onClick={() => trackPlaceView(id, category, district, tags)}
    >
      <div className="relative h-full flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={getFullImageUrl(image, name, category, images, updatedAt)}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {category}
            </span>
          </div>

          <button
            aria-label={`${bookmarked ? "Remove from" : "Add to"} bookmarks`}
            onClick={handleToggleSave}
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

          <div className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-xl text-sm font-bold bg-primary text-primary-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-none group-hover:shadow-lg group-hover:shadow-primary/20">
            Explore Details <Eye className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
})
