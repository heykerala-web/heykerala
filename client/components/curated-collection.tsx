"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface CollectionItem {
    id: string
    title: string
    image: string
    subtitle: string
}

interface CuratedCollectionProps {
    title: string
    subtitle: string
    items: CollectionItem[]
    viewAllLink?: string
}

export function CuratedCollection({ title, subtitle, items, viewAllLink = "/explore" }: CuratedCollectionProps) {
    return (
        <section className="py-16 container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl md:text-3xl font-outfit font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>
                <Link
                    href={viewAllLink}
                    className="text-sm font-bold uppercase tracking-widest text-accent hover:text-accent/80 flex items-center gap-2 transition-colors"
                >
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                    <Link
                        key={item.id}
                        href={`/places/${item.id}`}
                        className="group block"
                    >
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>

                        <h4 className="font-outfit font-bold text-lg group-hover:text-accent transition-colors">
                            {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
