"use client"

import { useEffect, useState } from "react"
import { EventCard } from "./event-card"
import { eventService, Event } from "@/services/eventService"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll()
        // Take first 4 events for the home page sections
        setEvents(data.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <section aria-labelledby="upcoming-events-heading">
      <div className="text-center mb-8">
        <h2 id="upcoming-events-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
          Upcoming Events & Festivals
        </h2>
        <p className="mt-2 text-gray-600">Join the vibrant celebrations happening across Kerala</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {events.map((e) => (
            <Link href={`/events/${e._id}`} key={e._id} className="block group">
              <EventCard
                id={e._id}
                name={e.title}
                date={new Date(e.startDate).toLocaleDateString()}
                time={e.time}
                location={e.district}
                image={e.images[0] || "/placeholder.svg"}
                description={e.description}
                category={e.category}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

