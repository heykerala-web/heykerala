"use client"

import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTourismImage } from "@/lib/images"

export interface EventCardProps {
  id: string
  name: string
  date: string
  time: string
  location: string
  image: string
  description: string
  category: string
}

export function EventCard({ name, date, time, location, image, description, category }: EventCardProps) {
  return (
    <article className="group relative h-full flex flex-col rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden hover:-translate-y-3 cursor-pointer">
      {/* Elite Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
      </div>

      <div className="relative h-56 overflow-hidden">
        <img
          src={getTourismImage(name, category)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

        <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 text-[10px] font-outfit font-black uppercase tracking-[0.2em] text-gray-900 shadow-sm border border-black/5 z-10">
          {category}
        </span>

        {date && (
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20">
              {date}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-xl font-outfit font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-sm font-medium">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            <span>{date}</span>
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
}
