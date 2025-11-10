import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getHotelById } from "@/lib/data"
import { MapPin, Star } from "lucide-react"

interface HotelPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: HotelPageProps) {
  const hotel = getHotelById(params.id)
  if (!hotel) return {}
  return {
    title: `${hotel.name} | Hey Kerala`,
    description: hotel.name + " in " + hotel.location,
  }
}

export default function HotelDetailPage({ params }: HotelPageProps) {
  const hotel = getHotelById(params.id)
  if (!hotel) notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm">
        <Link href="/hotels" className="text-emerald-600 hover:underline">
          Hotels
        </Link>
        <span className="mx-2 text-gray-400">{"/"}</span>
        <span className="text-gray-700">{hotel!.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{hotel!.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-700">
          <span className="inline-flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {hotel!.location}
          </span>
          <span className="inline-flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
            {hotel!.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center">
            <span className="text-2xl font-bold text-gray-900">₹{hotel!.price}</span>
            <span className="ml-1 text-sm text-gray-600">/night</span>
          </span>
        </div>
      </header>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-xl shadow">
          <Image
            src={hotel!.image || "/placeholder.svg"}
            alt={hotel!.name}
            width={1200}
            height={800}
            className="h-72 md:h-[420px] w-full object-cover"
          />
        </div>
        <aside className="rounded-xl bg-white shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Amenities</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {hotel!.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <a
              href="#book"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Check availability
            </a>
            <Link
              href="/hotels"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500"
            >
              Browse more
            </Link>
          </div>
        </aside>
      </section>

      <div id="book" className="mt-10 rounded-xl bg-white shadow p-6">
        <h3 className="text-lg font-semibold">Booking info</h3>
        <p className="text-sm text-gray-700 mt-2">Contact the property for latest prices and offers.</p>
      </div>
    </main>
  )
}
