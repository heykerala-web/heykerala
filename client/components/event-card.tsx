"use client"

import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    <article className="h-full flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-sm">
          {category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors mb-2">
          {name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="mr-2 h-4 w-4 text-emerald-600" />
            <span>{location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-emerald-600">
          <span>View Details</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </article>
  )
}
