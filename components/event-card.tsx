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
    <article className="rounded-xl bg-white shadow-md hover:shadow-lg overflow-hidden transition">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="h-48 w-full object-cover" />
        <span className="absolute left-3 top-3 inline-block rounded-full bg-rose-600 text-white text-xs font-semibold px-2 py-1">
          {category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>

        <div className="mt-2 space-y-2 text-gray-700">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{description}</p>

        <Button className="mt-4 w-full">Learn More</Button>
      </div>
    </article>
  )
}
