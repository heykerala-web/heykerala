"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SmartSearch } from "@/components/ai/SmartSearch"

export function SearchSection() {
  const [popularQuery, setPopularQuery] = useState("")

  return (
    <section className="-mt-16 md:-mt-20 relative z-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-transparent max-w-6xl mx-auto">

          <SmartSearch defaultQuery={popularQuery} />

          {/* Quick Filters / Popular */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Searches:</span>
            <div className="flex flex-wrap gap-2">
              {["Green Hills", "Tea Gardens", "Houseboats", "Sunset Beaches", "Wildlife Trails"].map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setPopularQuery(vibe)}
                  className="px-4 py-1.5 text-xs bg-white text-slate-500 border border-slate-200 rounded-full hover:bg-accent hover:text-white hover:border-accent hover:shadow-lg transition-all duration-500 cursor-pointer"
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
