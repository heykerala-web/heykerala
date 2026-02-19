"use client"

import { Star, MapPin, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTourismImage } from "@/lib/images"

interface StayCardProps {
    id: string
    name: string
    type: string
    district: string
    image: string
    rating: number
    price: number
    amenities: string[]
}

export function StayCard({
    id,
    name,
    type,
    district,
    image,
    rating,
    price,
    amenities,
}: StayCardProps) {
    return (
        <div className="group relative h-[420px] w-full rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
            {/* Image Background */}
            <div className="absolute inset-0">
                <img
                    src={getTourismImage(name, type)}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-3 py-1 font-medium tracking-wide">
                    {type}
                </Badge>
            </div>

            <div className="absolute top-4 right-4 z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/40 transition-colors">
                    <Heart className="h-4 w-4" />
                </div>
            </div>

            {/* Bottom Content Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Location & Rating Row */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-white/90 text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-accent" />
                        {district}
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-sm font-bold bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        {rating.toFixed(1)}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-outfit font-bold text-white mb-4 line-clamp-1 leading-tight group-hover:text-accent transition-colors duration-300">
                    {name}
                </h3>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                    <div>
                        <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mb-0.5">Starts from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-white">₹{price}</span>
                            <span className="text-xs text-white/70 font-medium">/ night</span>
                        </div>
                    </div>

                    <Link href={`/stay/${id}`}>
                        <Button size="icon" className="rounded-full h-12 w-12 bg-white text-primary hover:bg-accent hover:text-white transition-all duration-300 shadow-lg">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
