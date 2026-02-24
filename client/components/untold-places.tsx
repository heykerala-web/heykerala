"use client";

import { useEffect, useState } from "react";
import { UntoldCard } from "./place/untold-card";
import { placeService } from "@/services/placeService";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function UntoldPlaces() {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUntold = async () => {
            try {
                const response = await placeService.getAll({ untold: "true", limit: 3 });
                if (response && response.success) {
                    setPlaces(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch untold places", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUntold();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (places.length === 0) return null;

    return (
        <section className="relative py-24 bg-[#050505] rounded-[3rem] overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                            <Sparkles className="w-4 h-4" />
                            <span>Whispers of the Land</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Untold <span className="text-primary italic">Kerala</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Step off the beaten path and discover the soul of Kerala hidden in its quietest corners. These aren't just places; they're secrets waiting to be shared.
                        </p>
                    </div>

                    <Link href="/places?untold=true">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8 h-12 transition-all duration-500">
                            Explore All Secrets
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {places.map((place, i) => (
                        <UntoldCard key={place._id} place={place} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
