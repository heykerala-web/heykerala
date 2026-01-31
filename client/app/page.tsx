// Homepage Component
import { HeroCarousel } from "@/components/hero-carousel"
import { SearchSection } from "@/components/search-section"
import { CategoryGrid } from "@/components/category-grid"
import { TopPicks } from "@/components/top-picks"
import { TestimonialsSlider } from "@/components/testimonials-slider"
import { EmergencyLinks } from "@/components/emergency-links"
import { CallToAction } from "@/components/call-to-action"
import TrendingSpots from "@/components/trendingspot"



export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <HeroCarousel />

      <div className="bg-cover bg-center bg-no-repeat container
        mx-auto px-4 md:px-6 lg:px-10 max-w-7xl space-y-16 md:space-y-20 pb-20 lg:pb-8"
      >
        <SearchSection />
        <TrendingSpots />
        <CategoryGrid />
        <TopPicks />
        <TestimonialsSlider />
        <EmergencyLinks />
        <CallToAction />
      </div>
    </div>
  )
}
