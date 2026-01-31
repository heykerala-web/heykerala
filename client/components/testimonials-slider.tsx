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
    <section className="bg-gradient-to-br from-kerala-green/5 to-sea-blue/5 rounded-3xl p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">What Travelers Say</h2>
        <p className="text-gray-600 text-lg">Real experiences from real travelers</p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />

                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 text-lg mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>

                  <div className="border-t pt-4">
                    <h4 className="font-poppins font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    <p className="text-kerala-green text-sm font-medium mt-1">{testimonial.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>

        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-kerala-green" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
