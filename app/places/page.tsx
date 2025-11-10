import Link from "next/link"
import { places } from "@/lib/data"
import { PlaceCard } from "@/components/place-card"

export const metadata = {
  title: "Places | Hey Kerala",
  description: "Discover Kerala's must-visit destinations.",
}

export default function PlacesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Places in Kerala</h1>
        <p className="mt-2 text-gray-600">Explore hill stations, backwaters, beaches, wildlife and more.</p>
      </header>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <PlaceCard key={p.id} {...p} />
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
