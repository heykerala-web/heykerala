"use client"

import * as React from "react"
import Link from "next/link"
import { Star, MapPin, ArrowRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { getFullImageUrl } from "@/lib/images"

const trendingPlaces = [
    {
        id: "wayanad-hills",
        title: "Wayanad Hills",
        image: "/places/wayanadrainforest.jpg",
        rating: 4.9,
        reviews: 128,
        category: "Hill Station",
        location: "Wayanad District, Kerala",
    },
    {
        id: "varkala-cliff",
        title: "Varkala Cliff",
        image: "/places/varkala-clif.jpg",
        rating: 4.8,
        reviews: 245,
        category: "Beach",
        location: "Thiruvananthapuram",
    },
    {
        id: "alleppey-backwaters",
        title: "Alleppey Houseboats",
        image: "/places/alappuzhabackwaters.webp",
        rating: 4.9,
        reviews: 350,
        category: "Backwaters",
        location: "Alappuzha",
    },
    {
        id: "munnar-tea",
        title: "Munnar Tea Gardens",
        image: "/places/munnar-teagardens.jpg",
        rating: 5.0,
        reviews: 412,
        category: "Hill Station",
        location: "Idukki District",
    },
    {
        id: "bekal-fort",
        title: "Bekal Fort",
        image: "/places/bekal-fort..jpg",
        rating: 4.7,
        reviews: 98,
        category: "Heritage",
        location: "Kasaragod",
    },
]

export function TrendingCarousel() {
    const [emblaRef] = useEmblaCarousel({ align: "start", loop: false, skipSnaps: false })

    return (
        <section className="py-12 md:py-20 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 z-0 blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-4">Trending Now</h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            The most visited and highly rated destinations in Kerala this week.
                        </p>
                    </div>
                    <Link href="/explore">
                        <Button variant="ghost" className="hidden md:flex items-center gap-2 text-accent group">
                            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
                    <div className="flex gap-6 md:gap-8 pb-12">
                        {trendingPlaces.map((place) => (
                            <Link
                                key={place.id}
                                href={`/places/${place.id}`}
                                className="relative flex-[0_0_85%] md:flex-[0_0_400px] lg:flex-[0_0_450px] group cursor-pointer"
                            >
                                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                                    <img
                                        src={getFullImageUrl(place.image, place.title, place.category)}
                                        alt={place.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            {place.category}
                                        </span>
                                    </div>

                                    <div className="absolute top-6 right-6">
                                        <div className="bg-white rounded-xl px-3 py-1.5 flex flex-col items-center shadow-lg">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-3 w-3 fill-current" />
                                                <span className="text-sm font-bold text-gray-900">{place.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                        <h3 className="text-3xl font-outfit font-bold mb-2 group-hover:text-accent transition-colors">
                                            {place.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/70">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{place.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
