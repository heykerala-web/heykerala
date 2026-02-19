"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const heroSlides = [
  {
    image: "/kerala-backwaters-houseboat-golden-sunset.png",
    title: "Serene Backwaters",
    subtitle: "Cruise through tranquil canals on traditional houseboats",
    cta: "Where to go",
  },
  {
    image: "/munnar-tea-gardens-rolling-green-hills.png",
    title: "Misty Hill Stations",
    subtitle: "Breathe in the fresh mountain air among tea plantations",
    cta: "Where to go",
  },
  {
    image: "/kovalam-beach-palm-trees-sunrise.png",
    title: "Golden Beaches",
    subtitle: "Relax on pristine shores with swaying palm trees",
    cta: "Where to go",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000) // Slightly longer duration
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <section className="relative h-[100vh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Parallax-like scale effect */}
          <div className={`w-full h-full relative ${index === currentSlide ? 'animate-slow-zoom' : ''}`}>
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">

          <h1 className="text-hero md:text-[6rem] leading-[0.9] font-outfit font-black mb-6 text-white drop-shadow-2xl opacity-0 animate-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
            <span className="block text-3xl md:text-4xl font-light tracking-widest uppercase mb-4 text-white/80">Discover</span>
            Hey Kerala
          </h1>

          <div className="overflow-hidden">
            <h2 key={currentSlide} className="text-3xl md:text-5xl font-outfit font-bold text-white/90 mb-6 animate-in slide-in-from-bottom-4 duration-700">
              {heroSlides[currentSlide].title}
            </h2>
          </div>

          <p key={currentSlide + '-sub'} className="text-lg md:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed animate-in slide-in-from-bottom-4 delay-100 duration-700">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in zoom-in-50 delay-300 duration-700">
            <Link href="/where-to-go">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white border-2 border-primary hover:scale-105 transition-all duration-300 px-10 h-14 rounded-full text-lg shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] font-outfit font-bold"
              >
                Explore Destinations
              </Button>
            </Link>
            <Link href="/plan-trip">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white hover:text-black px-10 h-14 rounded-full text-lg font-outfit font-bold transition-all duration-300 hover:scale-105"
              >
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 hidden md:block"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110 hidden md:block"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${index === currentSlide ? "bg-white w-10 md:w-16" : "bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  )
}
