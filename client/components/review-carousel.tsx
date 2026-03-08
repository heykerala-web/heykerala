"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { getFullImageUrl } from "@/lib/images"

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=96&width=96",
    rating: 5,
    comment:
      "Kerala is absolutely magical! The backwaters, the food, the people—everything was perfect. Hey Kerala made planning so easy!",
    location: "New York, USA",
  },
  {
    id: 2,
    name: "Raj Patel",
    avatar: "/placeholder.svg?height=96&width=96",
    rating: 5,
    comment:
      "Amazing experience in God's Own Country. The tea plantations in Munnar were breathtaking. Highly recommend!",
    location: "Mumbai, India",
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=96&width=96",
    rating: 4,
    comment: "Beautiful beaches, delicious food, and warm hospitality. Kerala exceeded all my expectations!",
    location: "London, UK",
  },
]

export function ReviewCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % REVIEWS.length), 5000)
    return () => clearInterval(id)
  }, [])

  const prev = () => setCurrent((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)
  const next = () => setCurrent((i) => (i + 1) % REVIEWS.length)

  const r = REVIEWS[current]

  return (
    <section aria-labelledby="reviews-heading">
      <div className="text-center mb-8">
        <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
          What Travelers Say
        </h2>
        <p className="mt-2 text-gray-600">Authentic reviews from recent visitors</p>
      </div>

      <div className="relative rounded-2xl bg-white shadow p-6 md:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <img
            src={getFullImageUrl(r.avatar, r.name, "Traveler Profile")}
            alt={`${r.name} profile`}
            className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
          />
          <div className="mb-4 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <blockquote className="text-lg md:text-xl text-gray-800 italic">"{r.comment}"</blockquote>
          <div className="mt-4 text-gray-700">
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm">{r.location}</p>
          </div>
        </div>

        <button
          aria-label="Previous review"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:shadow-md"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <button
          aria-label="Next review"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:shadow-md"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>

        <div className="mt-6 flex justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full ${i === current ? "bg-emerald-600" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
