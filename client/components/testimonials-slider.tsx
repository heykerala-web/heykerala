"use client"

import { useEffect, useState } from "react"
import { Star, ChevronLeft, ChevronRight, Send } from "lucide-react"

const defaultTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "",
    rating: 5,
    text: "Kerala exceeded all my expectations! The backwaters were magical, and Hey Kerala made planning so easy. The AI assistant was incredibly helpful with local recommendations.",
    trip: "7-day Kerala Tour",
  },
  {
    id: 2,
    name: "Raj Patel",
    location: "Mumbai, India",
    avatar: "",
    rating: 5,
    text: "Amazing experience! The tea plantations in Munnar were breathtaking. The local food recommendations from the app were spot-on. Will definitely use Hey Kerala again!",
    trip: "Weekend Munnar Trip",
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "London, UK",
    avatar: "",
    rating: 5,
    text: "The cultural experiences were incredible. From Kathakali performances to temple visits, every moment was special. The app's offline maps saved us multiple times!",
    trip: "Cultural Kerala Journey",
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const avatarColors = [
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-sky-400 to-blue-600",
]

export function TestimonialsSlider() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)

  // Auto-slide
  useEffect(() => {
    if (justSubmitted) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length, justSubmitted])

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { alert("Please select a rating"); return }
    if (!name.trim()) { alert("Please enter your name"); return }
    if (!comment.trim()) { alert("Please write a review"); return }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      location: location.trim() || "traveler",
      avatar: "",
      rating,
      text: comment.trim(),
      trip: "Hey Kerala App",
    }

    setTestimonials((prev) => [newReview, ...prev])
    setCurrentIndex(0)
    setJustSubmitted(true)
    setRating(0)
    setName("")
    setLocation("")
    setComment("")
    setIsSubmitting(false)

    setTimeout(() => setJustSubmitted(false), 4000)
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"]

  return (
    <section className="space-y-12">
      {/* ── FORM ── */}
      <div className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-7">
          <h2 className="text-2xl md:text-3xl font-black text-white">Share Your Kerala Experience</h2>
          <p className="text-white/75 text-sm mt-1">Your review will appear in Traveler Insights below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          {/* Name + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Where are you from?</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA"
                className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-all hover:scale-125 active:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                      }`}
                  />
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span className="ml-2 text-sm font-bold text-primary">{ratingLabels[hoverRating || rating]}</span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Review *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 400))}
              placeholder="Tell others what made your Kerala trip unforgettable…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium placeholder:text-gray-300 resize-none leading-relaxed"
            />
            <p className="text-xs text-gray-300 text-right">{comment.length}/400</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Review
              </>
            )}
          </button>

          {justSubmitted && (
            <p className="text-center text-green-600 font-bold text-sm animate-pulse">
              ✓ Your review has been added — scroll down to see it!
            </p>
          )}
        </form>
      </div>

      {/* ── SLIDER ── */}
      <div className="bg-muted/30 rounded-[2.5rem] py-16 px-8 md:px-12 border border-white/20 shadow-inner">
        <div className="text-center mb-14">
          <h2 className="text-h2 mb-3 text-foreground">Traveler Insights</h2>
          <p className="text-muted-foreground text-base uppercase tracking-widest font-bold">Words from our community</p>
        </div>

        <div className="relative max-w-5xl mx-auto group/slider">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-&lsqb;cubic-bezier(0.23,_1,_0.32,_1)&rsqb;"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div key={t.id} className="w-full flex-shrink-0 px-4 md:px-12">
                  <div className="relative bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-lg border border-white/40 text-center">
                    {/* Quote icon */}
                    <div className="absolute top-10 left-10 text-primary/10 select-none">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor">
                        <path d="M20 30h10v10H20v10h10v10H20c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10zm20 0h10v10H40v10h10v10H40c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10z" />
                      </svg>
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-black text-xl shadow-xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]
                        }`}
                    >
                      {getInitials(t.name)}
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center mb-5 gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                      ))}
                    </div>

                    <blockquote className="text-foreground text-xl md:text-2xl font-medium mb-8 leading-snug tracking-tight">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    <div className="pt-6 border-t border-muted/50 max-w-xs mx-auto">
                      <h4 className="text-lg font-bold text-foreground mb-1">{t.name}</h4>
                      <p className="text-muted-foreground text-sm font-medium">{t.location}</p>
                      <div className="mt-3 inline-block px-3 py-1 bg-primary/10 rounded-full">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{t.trip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-4 rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden md:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-4 rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden md:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-10 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/20 w-2"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
