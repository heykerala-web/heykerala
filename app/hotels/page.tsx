import Link from "next/link"
import { hotels } from "@/lib/data"
import { HotelCard } from "@/components/hotel-card"

export const metadata = {
  title: "Hotels | Hey Kerala",
  description: "Find featured hotels and resorts across Kerala.",
}

export default function HotelsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Hotels & Resorts</h1>
        <p className="mt-2 text-gray-600">Comfortable stays for every budget and taste.</p>
      </header>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h) => (
          <HotelCard key={h.id} {...h} />
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
