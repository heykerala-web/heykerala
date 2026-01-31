"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, MapPin, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { placeService } from "@/services/placeService"

export function TopPicks() {
  const [topPicks, setTopPicks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const response = await placeService.getAll({ limit: 4, sort: '-ratingAvg' });
        if (response && response.success) {
          setTopPicks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch top picks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopPicks();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-2">Top Picks for You</h2>
          <p className="text-gray-600">Handpicked destinations loved by travelers</p>
        </div>
        <Link href="/places">
          <Button variant="outline" className="hidden md:flex bg-transparent">
            View All
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topPicks.map((place) => (
            <div
              key={place._id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={place.image || place.images?.[0] || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleFavorite(place._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(place._id) ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                  />
                </button>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                    {place.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-poppins font-semibold text-lg line-clamp-1">{place.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{place.ratingAvg || place.rating || 0}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.district || place.location}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{place.totalReviews || 0} reviews</div>
                  <div className="font-semibold text-emerald-600">{place.entryFee || "Free"}</div>
                </div>

                <Link href={`/places/${place._id}`}>
                  <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
