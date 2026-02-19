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
import { RecommendedForYou } from "@/components/ai/RecommendedForYou"
import { Container } from "@/components/ui/container"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />

      <Container size="xl" className="space-y-24 md:space-y-32 pb-32">
        <SearchSection />
        <TrendingSpots />
        <RecommendedForYou />
        <CategoryGrid />
        <TopPlaces />
        <FeaturedHotels />
        <UpcomingEvents />
        <TopPicks />
        <TestimonialsSlider />
        <EmergencyLinks />
        <CallToAction />
      </Container>
    </div>
  )
}
