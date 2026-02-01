// Homepage Component
import { HeroCarousel } from "@/components/hero-carousel"
import { SearchSection } from "@/components/search-section"
import { CategoryGrid } from "@/components/category-grid"
import { TopPicks } from "@/components/top-picks"
import { TestimonialsSlider } from "@/components/testimonials-slider"
import { EmergencyLinks } from "@/components/emergency-links"
import { CallToAction } from "@/components/call-to-action"
import TrendingSpots from "@/components/trendingspot"
import { TopPlaces } from "@/components/top-places"
import { FeaturedHotels } from "@/components/featured-hotels"
import { UpcomingEvents } from "@/components/upcoming-events"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />

      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px] space-y-24 md:space-y-32 pb-32">
        <SearchSection />
        <TrendingSpots />
        <CategoryGrid />
        <TopPlaces />
        <FeaturedHotels />
        <UpcomingEvents />
        <TopPicks />
        <TestimonialsSlider />
        <EmergencyLinks />
        <CallToAction />
      </div>
    </div>
  )
}
