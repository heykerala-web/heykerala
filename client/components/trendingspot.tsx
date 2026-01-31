"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { placeService } from "@/services/placeService";

export default function KeralaTourism() {
  const [trendingSpots, setTrendingSpots] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await placeService.getAll({ limit: 4 });
        if (response && response.success) {
          setTrendingSpots(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch trending spots", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleNext = () => {
    if (trendingSpots.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % trendingSpots.length);
  };

  const handlePrev = () => {
    if (trendingSpots.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + trendingSpots.length) % trendingSpots.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (trendingSpots.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Trending Spots Section */}
      <section className="relative w-full py-15 md:py-15 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                Popular Destinations
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Trending Spots
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Explore the must-visit destinations across God's Own Country
            </p>
          </div>

          {/* Cards Container */}
          <div className="relative max-w-7xl mx-auto">
            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
              {trendingSpots.slice(0, 3).map((spot, i) => (
                <TrendingCard key={spot._id} spot={spot} index={i} />
              ))}
            </div>

            {/* Mobile/Tablet: Slider */}
            <div className="lg:hidden relative">
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {trendingSpots.map((spot, i) => (
                    <div key={spot._id} className="w-full flex-shrink-0 px-4">
                      <TrendingCard spot={spot} index={i} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex gap-2">
                  {trendingSpots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Explore More Button */}
          <div className="flex justify-center mt-12 md:mt-16">
            <Link href="/places">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 rounded-full shadow-lg"
              >
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrendingCard({ spot, index }: { spot: any; index: number }) {
  return (
    <Link
      href={`/places/${spot._id}`}
      className="group relative h-[500px] rounded-[2rem] overflow-hidden bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 block"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={spot.image || spot.images?.[0] || "/placeholder.svg"}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
          <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-3">
            {spot.category}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {spot.name}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-base md:text-lg">
            <MapPin className="w-5 h-5" />
            <span>{spot.district || spot.location}</span>
          </div>
        </div>

        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Button
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-foreground"
          >
            Explore Destination
          </Button>
        </div>
      </div>

      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}
