import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPlaceById } from "@/lib/data"
import { MapPin, Star } from "lucide-react"

interface PlacePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PlacePageProps) {
  const place = getPlaceById(params.id)
  if (!place) return {}
  return {
    title: `${place.name} | Hey Kerala`,
    description: place.description,
  }
}

export default function PlaceDetailPage({ params }: PlacePageProps) {
  const place = getPlaceById(params.id)
  if (!place) {
    notFound()
  }
  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm">
        <Link href="/places" className="text-emerald-600 hover:underline">
          Places
        </Link>
        <span className="mx-2 text-gray-400">{"/"}</span>
        <span className="text-gray-700">{place!.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{place!.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-700">
          <span className="inline-flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {place!.location}
          </span>
          <span className="inline-flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
            {place!.rating.toFixed(1)}
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
            {place!.category}
          </span>
        </div>
      </header>

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-xl shadow">
          <Image
            src={place!.image || "/placeholder.svg"}
            alt={place!.name}
            width={1200}
            height={800}
            className="h-72 md:h-[420px] w-full object-cover"
          />
        </div>
        <aside className="rounded-xl bg-white shadow p-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700">{place!.longDescription}</p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Highlights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {place!.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="#map"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View on map
            </a>
            <Link
              href="/places"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500"
            >
              Browse more
            </Link>
          </div>
        </aside>
      </section>

      <div id="map" className="mt-10 rounded-xl overflow-hidden bg-white shadow">
        <img src="/map-preview-for-kerala-place.png" alt="Map preview" className="w-full h-80 object-cover" />
      </div>
    </main>
  )
}
