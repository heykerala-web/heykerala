"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

const slides = [
  {
    src: "/kerala-backwaters-houseboat-golden-sunset.png",
    alt: "Kerala backwaters with houseboat at golden sunset",
  },
  {
    src: "/munnar-tea-gardens-rolling-green-hills.png",
    alt: "Munnar tea gardens with rolling green hills",
  },
  {
    src: "/kovalam-beach-palm-trees-sunrise.png",
    alt: "Kovalam beach lined with palm trees at sunrise",
  },
]

export function HeroSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [])

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <img src={s.src || "/placeholder.svg"} alt={s.alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Hey Kerala</h1>
        <p className="mt-4 text-lg md:text-2xl opacity-95">Where every path unfolds your story</p>

        {/* Indicators */}
        <div className="mt-6 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={scrollDown}
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 hover:text-white transition-colors"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </button>
    </section>
  )
}
