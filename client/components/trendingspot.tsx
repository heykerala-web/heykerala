"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { placeService } from "@/services/placeService";
import { getFullImageUrl } from "@/lib/images";
import { SafeImage } from "@/components/ui/SafeImage";

export default function KeralaTourism() {
  const [trendingSpots, setTrendingSpots] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await placeService.getTrending();
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
          <div className="mb-12 md:mb-16">
            <h2 className="text-h1 mb-4">
              Trending Destinations
            </h2>
            <p className="text-muted-foreground text-body-lg max-w-2xl">
              Explore the most loved places across God's Own Country this season.
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
          <div className="flex justify-start mt-12 md:mt-16">
            <Link href="/places">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 h-12 rounded-full"
              >
                View All Destinations
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
      className="group relative h-[500px] rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 block"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0">
        <SafeImage
          src={getFullImageUrl(spot.image || spot.images?.[0], spot.name, spot.category)}
          alt={spot.name}
          fallbackName={spot.name}
          fallbackCategory={spot.category}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium uppercase tracking-wider border border-white/20">
              {spot.category}
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-white tracking-tight leading-tight">
            {spot.name}
          </h3>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{spot.district || spot.location}</span>
          </div>
        </div>

        <div className="mt-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <Button
            variant="secondary"
            className="w-full bg-white text-black hover:bg-gray-100 rounded-xl h-12 font-medium"
          >
            Discover Experience
          </Button>
        </div>
      </div>
    </Link>
  );
}
