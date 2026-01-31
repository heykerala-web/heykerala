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
        <div className="group rounded-xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="relative h-52 w-full overflow-hidden">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-black hover:bg-white capitalize shadow-sm">
                        {type}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 text-white">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {district}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 hidden">
                    {/* Description could go here if needed */}
                </p>

                <div className="mt-auto flex items-end justify-between border-t pt-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Starts from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">₹{price}</span>
                            <span className="text-xs text-gray-500">/ night</span>
                        </div>
                    </div>

                    <Link href={`/stay/${id}`}>
                        <Button size="sm" className="gap-2 group-hover:translate-x-1 transition-transform">
                            View <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
