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
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-4">
              <span className="golden">Hey</span> Kerala
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">{heroSlides[currentSlide].title}</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">{heroSlides[currentSlide].subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/where-to-go">
                <Button
                  size="lg"
                  className="bg-kerala-green hover:bg-kerala-green/90 text-white px-8 py-3 rounded-full"
                >
                  Where to go
                </Button>
              </Link>
              <Link href="/plan-trip">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full bg-transparent"
                >
                  Plan My Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
