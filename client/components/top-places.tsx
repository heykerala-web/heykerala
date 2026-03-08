"use client"

import { useState, useEffect } from "react"
import { PlaceCard } from "./place-card"
import { placeService } from "@/services/placeService"
import { Loader2 } from "lucide-react"

export function TopPlaces() {
  const [topPlaces, setTopPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopPlaces = async () => {
      try {
        const response = await placeService.getAll({ limit: 4, sort: 'popular' })
        if (response && response.success) {
          setTopPlaces(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch top places", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTopPlaces()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (topPlaces.length === 0) return null

  return (
    <section aria-labelledby="top-places-heading">
      <div className="text-center mb-8">
        <h2 id="top-places-heading" className="text-3xl md:text-4xl font-outfit font-bold text-foreground">
          Top Places in Kerala
        </h2>
        <p className="mt-2 text-muted-foreground">Discover the most loved destinations across God&apos;s Own Country</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {topPlaces.map((p) => (
          <PlaceCard
            key={p._id}
            id={p._id}
            name={p.name}
            location={p.district || p.location}
            image={p.image}
            rating={p.ratingAvg || 0}
            description={p.description}
            category={p.category}
            images={p.images}
            district={p.district}
            tags={p.tags}
            updatedAt={p.updatedAt}
          />
        ))}
      </div>
    </section>
  )
}
