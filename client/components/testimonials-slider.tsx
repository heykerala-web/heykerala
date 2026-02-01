"use client"

import { useEffect, useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s?height=80&width=80",
    rating: 5,
    text: "Kerala exceeded all my expectations! The backwaters were magical, and Hey Kerala made planning so easy. The AI assistant was incredibly helpful with local recommendations.",
    trip: "7-day Kerala Tour",
  },
  {
    id: 2,
    name: "Raj Patel",
    location: "Mumbai, India",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s?height=80&width=80",
    rating: 5,
    text: "Amazing experience! The tea plantations in Munnar were breathtaking. The local food recommendations from the app were spot-on. Will definitely use Hey Kerala again!",
    trip: "Weekend Munnar Trip",
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "London, UK",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s?height=80&width=80",
    rating: 5,
    text: "The cultural experiences were incredible. From Kathakali performances to temple visits, every moment was special. The app's offline maps saved us multiple times!",
    trip: "Cultural Kerala Journey",
  },
]

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="bg-muted/30 rounded-[2.5rem] py-20 px-8 md:px-12 border border-white/20 shadow-inner">
      <div className="text-center mb-16">
        <h2 className="text-h2 mb-4 text-foreground">Traveler Insights</h2>
        <p className="text-muted-foreground text-lg uppercase tracking-widest font-bold">Words from our community</p>
      </div>

      <div className="relative max-w-5xl mx-auto group/slider">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,_1,_0.32,_1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4 md:px-12">
                <div className="relative bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-lg border border-white/40 text-center">
                  {/* Quote Icon */}
                  <div className="absolute top-10 left-10 text-primary/10 select-none">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor">
                      <path d="M20 30h10v10H20v10h10v10H20c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10zm20 0h10v10H40v10h10v10H40c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10z" />
                    </svg>
                  </div>

                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full mx-auto mb-8 object-cover border-4 border-white shadow-xl"
                  />

                  <div className="flex justify-center mb-6 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                    ))}
                  </div>

                  <blockquote className="text-foreground text-2xl md:text-3xl font-medium mb-10 leading-snug tracking-tight">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>

                  <div className="pt-8 border-t border-muted/50 max-w-xs mx-auto">
                    <h4 className="text-xl font-bold text-foreground mb-1">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm font-medium">{testimonial.location}</p>
                    <div className="mt-3 inline-block px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{testimonial.trip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-5 rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden md:block"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-5 rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden md:block"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="flex justify-center mt-12 gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/20"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
