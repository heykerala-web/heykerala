"use client"

import * as React from "react"
import Link from "next/link"
import { Star, MapPin, Sparkles } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { API_URL, tokenManager } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface Recommendation {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    ratingAvg: number;
    category: string;
    district: string;
}

export function RecommendedForYou() {
    const { user, updateUser } = useAuth();
    const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [personaLoading, setPersonaLoading] = React.useState(false);
    const [emblaRef] = useEmblaCarousel({ align: "start", loop: false, skipSnaps: false });

    React.useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Determine suggested weather context based on time
                const hour = new Date().getHours();
                let weatherParam = "Sunny";
                if (hour >= 18 || hour < 6) weatherParam = "Rainy";

                const token = tokenManager.get();
                const headers: any = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/ai/recommendations?weather=${weatherParam}`, { headers });
                const data = await response.json();
                if (Array.isArray(data)) setRecommendations(data);

                // If user exists and has "New Traveler" persona, try to generate a real one
                if (user && (user as any).persona === "New Traveler" && !personaLoading) {
                    const savedCount = ((user as any).savedPlaces?.length || 0) +
                        ((user as any).savedStays?.length || 0) +
                        ((user as any).savedEvents?.length || 0);

                    if (savedCount >= 2) {
                        setPersonaLoading(true);
                        const personaRes = await fetch(`${API_URL}/ai/persona/generate`, {
                            method: "POST",
                            headers
                        });
                        const personaData = await personaRes.json();
                        if (personaData.success) {
                            updateUser({ persona: personaData.persona, travelInterests: personaData.interests });
                        }
                        setPersonaLoading(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user?._id]);

    if (loading) return null;
    if (recommendations.length === 0) return null;

    const userPersona = (user as any)?.persona;

    return (
        <section className="py-12 md:py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-accent/10 p-3 rounded-2xl shadow-inner">
                            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight">Recommended for You</h2>
                                {userPersona && userPersona !== "New Traveler" && (
                                    <span className="hidden md:inline-flex items-center px-4 py-1 rounded-full bg-accent/20 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mt-1">
                                        MAPPED: {userPersona}
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium text-lg">
                                {userPersona && userPersona !== "New Traveler"
                                    ? `Tailored collections for ${userPersona.startsWith('The') ? userPersona : 'the ' + userPersona}`
                                    : "AI-powered suggestions based on current trends and weather"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
                    <div className="flex gap-6 pb-8">
                        {recommendations.map((item) => (
                            <Link
                                key={item._id}
                                href={`/places/${item._id}`}
                                className="relative flex-[0_0_80%] md:flex-[0_0_350px] group cursor-pointer"
                            >
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                                    <img
                                        src={item.image || (item.images && item.images[0]) || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-bold text-white">{item.ratingAvg || 0}</span>
                                        </div>
                                        <h3 className="text-xl font-outfit font-bold mb-1 group-hover:text-accent transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-white/70">
                                            <MapPin className="h-3 w-3" />
                                            <span className="text-xs">{item.district}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
