import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getEventById } from "@/lib/data"
import { Calendar, Clock, MapPin } from "lucide-react"

interface EventPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = getEventById(params.id)
  if (!event) return {}
  return {
    title: `${event.name} | Hey Kerala`,
    description: event.description,
  }
}

export default function EventDetailPage({ params }: EventPageProps) {
  const event = getEventById(params.id)
  if (!event) notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm">
        <Link href="/events" className="text-emerald-600 hover:underline">
          Events
        </Link>
        <span className="mx-2 text-gray-400">{"/"}</span>
        <span className="text-gray-700">{event!.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{event!.name}</h1>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700">
          <span className="inline-flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {event!.date}
          </span>
          <span className="inline-flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {event!.time}
          </span>
          <span className="inline-flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event!.location}
          </span>
        </div>
      </header>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-xl shadow">
          <Image
            src={event!.image || "/placeholder.svg"}
            alt={event!.name}
            width={1200}
            height={800}
            className="h-72 md:h-[420px] w-full object-cover"
          />
        </div>
        <aside className="rounded-xl bg-white shadow p-6">
          <h2 className="text-lg font-semibold mb-2">About this event</h2>
          <p className="text-gray-700">{event!.description}</p>

          <div className="mt-6 flex gap-3">
            <a
              href="#schedule"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View schedule
            </a>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500"
            >
              Browse more
            </Link>
          </div>
        </aside>
      </section>

      <div id="schedule" className="mt-10 rounded-xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold">Schedule</h3>
        <p className="text-sm text-gray-700 mt-2">Detailed schedule will be announced by the organizers.</p>
      </div>
    </main>
  )
}
