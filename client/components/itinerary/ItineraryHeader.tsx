"use client";

import Image from "next/image";

interface ItineraryHeaderProps {
  title: string;
  duration: number;
  travelers: string;
  budgetEstimate: { min: number; max: number };
  heroImage: string;
  aiReason?: string | null;
}

export default function ItineraryHeader({
  title,
  duration,
  travelers,
  budgetEstimate,
  heroImage,
  aiReason,
}: ItineraryHeaderProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm md:text-base">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>📅</span>
            <span>{duration} Days</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>👥</span>
            <span>{travelers}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>💰</span>
            <span>₹{budgetEstimate.min.toLocaleString()} - ₹{budgetEstimate.max.toLocaleString()}</span>
          </div>
        </div>

        {aiReason && (
          <div className="bg-amber-500/90 backdrop-blur-sm p-4 rounded-xl mt-4 max-w-3xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-semibold mb-1">AI Recommendation</p>
                <p className="text-sm opacity-90">{aiReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}








