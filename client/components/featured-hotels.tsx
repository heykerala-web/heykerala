"use client"

import { useState, useEffect } from "react"
import { HotelCard } from "./hotel-card"
import { stayService } from "@/services/stayService"
import { Loader2 } from "lucide-react"

export function FeaturedHotels() {
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const response = await stayService.getAll({ limit: 4 })
        if (response && response.success) {
          setFeaturedHotels(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch featured hotels", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedHotels()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (featuredHotels.length === 0) return null

  return (
    <section aria-labelledby="featured-hotels-heading">
      <div className="text-center mb-8">
        <h2 id="featured-hotels-heading" className="text-3xl md:text-4xl font-outfit font-bold text-foreground">
          Featured Hotels & Resorts
        </h2>
        <p className="mt-2 text-muted-foreground">Stay in comfort and luxury at Kerala&apos;s finest accommodations</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {featuredHotels.map((h) => (
          <HotelCard
            key={h._id}
            id={h._id}
            name={h.name}
            location={h.district}
            image={h.image || h.images?.[0] || ""}
            rating={h.ratingAvg || 0}
            price={h.price || 0}
            amenities={h.amenities || []}
            updatedAt={h.updatedAt}
          />
        ))}
      </div>
    </section>
  )
}
