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
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-h2 mb-4">Curated Selections</h2>
          <p className="text-body-lg text-muted-foreground">Handpicked destinations for an unforgettable journey.</p>
        </div>
        <Link href="/places">
          <Button variant="link" className="hidden md:flex text-primary font-bold uppercase tracking-widest text-xs p-0 h-auto">
            View All Selections <div className="ml-3 h-0.5 w-8 bg-primary rounded-full transition-all group-hover:w-12" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topPicks.map((place) => (
            <Link
              key={place._id}
              href={`/places/${place._id}`}
              className="group bg-white rounded-[2.5rem] overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 transform hover:-translate-y-2 flex flex-col h-full border border-white/40"
            >
              <div className="relative aspect-[4/5] overflow-hidden shrink-0">
                <img
                  src={place.image || place.images?.[0] || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20 shadow-2xl">
                    {place.category}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.preventDefault(); toggleFavorite(place._id); }}
                  className="absolute top-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white hover:text-destructive transition-all duration-300 z-10"
                >
                  <Heart
                    className={`h-5 w-5 ${favorites.includes(place._id) ? "text-destructive fill-current" : ""}`}
                  />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-bold text-accent">{place.ratingAvg || place.rating || 0}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {place.district}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">{place.name}</h3>

                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-6 italic">
                  "{place.description}"
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-muted/50">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{place.totalReviews || 0} REVIEWS</div>
                  <div className="text-primary font-bold">{place.entryFee === "0" || !place.entryFee ? "Complimentary" : `₹${place.entryFee}`}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
