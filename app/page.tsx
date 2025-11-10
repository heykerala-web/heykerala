import { HeroCarousel } from "@/components/hero-carousel"
import { SearchSection } from "@/components/search-section"
import { CategoryGrid } from "@/components/category-grid"
import { TopPicks } from "@/components/top-picks"
import { TestimonialsSlider } from "@/components/testimonials-slider"
import { EmergencyLinks } from "@/components/emergency-links"
import { CallToAction } from "@/components/call-to-action"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroCarousel />

      <div className="container mx-auto px-4 space-y-16 pb-20 lg:pb-8">
        <SearchSection />
        <CategoryGrid />
        <TopPicks />
        <TestimonialsSlider />
        <EmergencyLinks />
        <CallToAction />
      </div>
    </div>
  )
}
