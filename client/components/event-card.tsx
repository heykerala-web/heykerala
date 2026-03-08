"use client"

import React, { useState, useEffect } from "react"
import { Calendar, MapPin, Eye, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getFullImageUrl } from "@/lib/images"
import { EventStatusBadge } from "@/components/events/EventStatusBadge"
import { useAuth } from "@/context/AuthContext"
import api from "@/services/api"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export interface EventCardProps {
  id: string
  name: string
  date: string
  time?: string
  location: string
  image?: string
  images?: string[]
  description: string
  category: string
  eventStatus?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  viewCount?: number
  isFeatured?: boolean
  isBookmarked?: boolean
  updatedAt?: string | Date
}

export const EventCard = React.memo(function EventCard({
  id, name, date, time, location, image, images, description, category,
  eventStatus = 'upcoming', viewCount = 0, isFeatured = false, isBookmarked = false, updatedAt
}: EventCardProps) {
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const isActuallySaved = user?.savedEvents?.some((e: any) => {
    const savedId = typeof e === 'string' ? e : e._id;
    return savedId === id;
  }) ?? isBookmarked;

  const [bookmarked, setBookmarked] = useState(isActuallySaved)

  useEffect(() => {
    setBookmarked(isActuallySaved);
  }, [isActuallySaved]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please login to save events")
      router.push("/login")
      return
    }

    try {
      if (bookmarked) {
        await api.delete(`/users/save/event/${id}`)
        const newSaved = user.savedEvents?.filter((e: any) => {
          const savedId = typeof e === 'string' ? e : e._id;
          return savedId !== id;
        });
        updateUser({ savedEvents: newSaved });
        toast.success("Removed from wishlist")
      } else {
        await api.post(`/users/save/event/${id}`)
        const newSaved = [...(user.savedEvents || []), id];
        updateUser({ savedEvents: newSaved });
        toast.success("Saved to wishlist!")
      }
      setBookmarked(b => !b)
    } catch {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <article className="group relative h-full flex flex-col rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden hover:-translate-y-3 cursor-pointer">
      {/* Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
      </div>

      {/* Featured ribbon */}
      {isFeatured && (
        <div className="absolute top-0 right-0 z-30">
          <div className="bg-amber-400 text-amber-900 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl rounded-tr-[2.5rem]">
            ⭐ Featured
          </div>
        </div>
      )}

      <div className="relative h-56 overflow-hidden">
        <Image
          src={getFullImageUrl(image, name, category, images, updatedAt)}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

        {/* Category badge */}
        <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-[9px] font-outfit font-black uppercase tracking-[0.2em] text-gray-900 shadow-sm border border-black/5 z-10">
          {category}
        </span>

        {/* Status badge */}
        {eventStatus && (
          <div className="absolute left-5 bottom-5 z-10">
            <EventStatusBadge status={eventStatus} />
          </div>
        )}

        {/* Bookmark button */}
        <button
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark event"}
          onClick={toggleBookmark}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-primary transition-all z-30"
        >
          {bookmarked
            ? <BookmarkCheck className="h-4 w-4 fill-primary text-primary" />
            : <Bookmark className="h-4 w-4" />
          }
        </button>

        {/* View count */}
        {viewCount > 0 && (
          <div className="absolute right-5 bottom-5 flex items-center gap-1 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
            <Eye className="h-3 w-3" />
            {viewCount > 999 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-xl font-outfit font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center text-muted-foreground text-sm font-medium">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            <span>{date}</span>
            {time && <span className="ml-2 text-xs text-gray-400">· {time}</span>}
          </div>
          <div className="flex items-center text-muted-foreground text-sm font-medium">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary">
          <span>View Details</span>
          <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
        </div>
      </div>
    </article>
  )
})

