"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturedStory() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent to-purple-600 rounded-[2.5rem] rotate-3 opacity-20 blur-xl transition-all duration-700 group-hover:rotate-2 group-hover:opacity-30" />
                        <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl">
                            <img
                                src="/places/wayanadrainforest.jpg"
                                alt="Wayanad Rainforest"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full text-accent font-bold text-xs uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Featured Story
                        </div>

                        <h2 className="text-4xl md:text-5xl font-outfit font-bold leading-tight">
                            Wayanad: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">
                                The Jewel of Western Ghats
                            </span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Hidden amidst the misty mountains, Wayanad offers more than just scenic beauty.
                            It's a journey into the soul of nature, where ancient caves whisper history and
                            wild elephants roam free. Discover why this emerald paradise is Kerala's
                            best-kept secret.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/explore">
                                <Button className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
                                    Read the Story
                                </Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="outline" className="h-14 px-8 rounded-xl border-primary/20 hover:bg-primary/5 text-lg group">
                                    Explore Places <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
