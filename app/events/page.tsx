import Link from "next/link"
import { events } from "@/lib/data"
import { EventCard } from "@/components/event-card"

export const metadata = {
  title: "Events | Hey Kerala",
  description: "Festivals and cultural events across Kerala.",
}

export default function EventsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Events & Festivals</h1>
        <p className="mt-2 text-gray-600">Experience the rhythm and culture of Kerala.</p>
      </header>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <EventCard key={e.id} {...e} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-emerald-600 hover:underline">
          Back to home
        </Link>
      </div>
    </main>
  )
}
