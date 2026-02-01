"use client"

import { Star, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
        <div className="group relative rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden flex flex-col h-full hover:-translate-y-3 cursor-pointer">
            {/* Elite Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            </div>
            <div className="relative h-52 w-full overflow-hidden">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/95 backdrop-blur-md text-foreground hover:bg-white capitalize shadow-sm border-none px-3 py-1 font-bold text-[10px] tracking-widest">
                        {type}
                    </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 text-foreground shadow-sm border border-black/5">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-outfit font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm font-medium mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                            {district}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 hidden">
                    {/* Description could go here if needed */}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Starts from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">₹{price}</span>
                            <span className="text-xs text-muted-foreground font-medium">/ night</span>
                        </div>
                    </div>

                    <Link href={`/stay/${id}`}>
                        <Button className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl h-11 px-5 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all duration-300">
                            Book <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
