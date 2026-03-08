"use client"

/**
 * RecommendedForYou.tsx
 * ----------------------
 * Smart recommendation section on the homepage.
 *
 * States:
 *  1. Guest (not logged in)        → Login CTA ("Unlock Your Personalized Kerala")
 *  2. Logged in, no history yet    → "Popular Destinations in Kerala" (top-rated fallback)
 *  3. Logged in, has interaction history → "Recommended For You" (rule-based personalized)
 *
 * API endpoint: GET /api/ai/recommendations?sessionId=<uuid>
 * Response: { places, explanation, sectionTitle, isPersonalized, preferenceProfile }
 */

import * as React from "react"
import Link from "next/link"
import { Star, MapPin, Sparkles, Loader2, Zap, TrendingUp, RefreshCw } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { API_URL, tokenManager } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { getFullImageUrl } from "@/lib/images"
import { SafeImage } from "@/components/ui/SafeImage"
import { getSessionId } from "@/lib/interactionTracker"

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface RecommendedPlace {
    _id: string
    name: string
    image: string
    images?: string[]
    ratingAvg: number
    category: string
    district: string
    score?: number
}

interface RecommendationResponse {
    places: RecommendedPlace[]
    explanation: string
    sectionTitle: string
    isPersonalized: boolean
    preferenceProfile: {
        preferredCategory: string | null
        preferredDistrict: string | null
        interestTags: string[]
    } | null
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export function RecommendedForYou() {
    const { user } = useAuth()
    const [data, setData] = React.useState<RecommendationResponse | null>(null)
    const [loading, setLoading] = React.useState(false) // don't load for guests
    const [emblaRef] = useEmblaCarousel({ align: "start", loop: false, skipSnaps: false })

    // Fetch recommendations only for logged-in users
    const fetchRecommendations = React.useCallback(async () => {
        setLoading(true)
        try {
            const sessionId = getSessionId()
            const token = tokenManager.get()
            const headers: Record<string, string> = { "Content-Type": "application/json" }
            if (token) headers["Authorization"] = `Bearer ${token}`

            const url = `${API_URL}/ai/recommendations?sessionId=${encodeURIComponent(sessionId)}`
            const response = await fetch(url, { headers })

            if (!response.ok) return

            const json = await response.json()

            // Handle both old array format and new object format (backward compat)
            if (Array.isArray(json)) {
                setData({
                    places: json,
                    explanation: "Popular destinations loved by Kerala travellers",
                    sectionTitle: "Popular Destinations in Kerala",
                    isPersonalized: false,
                    preferenceProfile: null,
                })
            } else {
                setData(json)
            }
        } catch (error) {
            console.error("Failed to fetch recommendations:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Only auto-fetch when user is logged in
    React.useEffect(() => {
        if (user) {
            fetchRecommendations()
        }
    }, [user, fetchRecommendations])

    const userPersona = (user as any)?.persona

    // ------------------------------------------------------------------
    // STATE 1: Guest (not logged in) → Show login CTA
    // ------------------------------------------------------------------
    if (!user) {
        return (
            <section className="py-12 md:py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-dashed border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto space-y-8 p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest">
                            <Sparkles className="h-4 w-4" />
                            Smart Recommendations
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight text-slate-900 dark:text-white">
                                Unlock Your <span className="text-accent">Personalized</span> Kerala
                            </h2>
                            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                Log in to get destination suggestions based on the places you've saved and explored!
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 bg-accent hover:bg-accent/90 text-white rounded-2xl shadow-lg shadow-accent/20 transition-all hover:scale-105 font-bold text-lg"
                                >
                                    Log In to Explore
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="h-14 px-8 rounded-2xl font-bold text-lg text-slate-600 dark:text-slate-400"
                                >
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                        <div className="pt-4 flex items-center justify-center gap-6 text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Zap className="h-4 w-4 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-wider">Smart Suggestions</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-wider">Based on Your Saves</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ------------------------------------------------------------------
    // STATE 2: Logged in, loading
    // ------------------------------------------------------------------
    if (loading) {
        return (
            <section className="py-12 md:py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="bg-accent/10 p-3 rounded-2xl shadow-inner">
                            <Loader2 className="h-8 w-8 text-accent animate-spin" />
                        </div>
                        <div>
                            <div className="h-8 w-60 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-2" />
                            <div className="h-4 w-80 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-[0_0_80%] md:flex-[0_0_300px] aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // ------------------------------------------------------------------
    // STATE 3: No data or empty
    // ------------------------------------------------------------------
    if (!data || data.places.length === 0) return null

    // ------------------------------------------------------------------
    // STATE 4: Show recommendations (personalized OR popular fallback)
    // ------------------------------------------------------------------
    const { places, explanation, sectionTitle, isPersonalized, preferenceProfile } = data

    return (
        <section className="py-12 md:py-20 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
            <div className="container mx-auto px-6 relative z-10">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="bg-accent/10 p-3 rounded-2xl shadow-inner flex-shrink-0">
                            {isPersonalized ? (
                                <Sparkles className="h-8 w-8 text-accent" />
                            ) : (
                                <TrendingUp className="h-8 w-8 text-accent" />
                            )}
                        </div>

                        <div>
                            {/* Section badge – always "Recommended For You" */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest mb-3">
                                <Sparkles className="h-3 w-3" /> Recommended For You
                            </div>

                            {/* Title */}
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-3xl md:text-4xl font-outfit font-black tracking-tight">
                                    {sectionTitle}
                                </h2>
                                {userPersona && userPersona !== "New Traveler" && (
                                    <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                                        {userPersona}
                                    </span>
                                )}
                            </div>

                            {/* Explanation */}
                            <p className="text-muted-foreground text-base mt-2 max-w-xl">
                                {explanation}
                            </p>

                            {/* Interest tag pills – only for personalized */}
                            {isPersonalized && preferenceProfile?.interestTags && preferenceProfile.interestTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {preferenceProfile.interestTags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Helper tip for new users with no history yet */}
                            {!isPersonalized && (
                                <p className="text-xs text-muted-foreground/70 mt-2 italic">
                                    💡 Save or explore a few places and we'll personalize this section just for you!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Refresh button */}
                    <Button
                        onClick={fetchRecommendations}
                        variant="outline"
                        className="hidden md:flex gap-2 flex-shrink-0"
                    >
                        <RefreshCw className="h-4 w-4 text-accent" />
                        Refresh
                    </Button>
                </div>

                {/* ── Place Cards Carousel ────────────────────────────────── */}
                <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
                    <div className="flex gap-6 pb-8">
                        {places.map((item) => (
                            <Link
                                key={item._id}
                                href={`/places/${item._id}`}
                                className="relative flex-[0_0_80%] md:flex-[0_0_320px] group cursor-pointer"
                            >
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">

                                    <SafeImage
                                        src={getFullImageUrl(item.image, item.name, item.category)}
                                        alt={item.name}
                                        fallbackName={item.name}
                                        fallbackCategory={item.category}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Score badge – only for personalized, useful for demo */}
                                    {isPersonalized && item.score !== undefined && item.score > 0 && (
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-accent/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
                                                ⚡ {item.score}pt
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-bold text-white">
                                                {item.ratingAvg?.toFixed(1) || "5.0"}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-outfit font-bold mb-1 group-hover:text-accent transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-white/70">
                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                            <span className="text-xs truncate">{item.district}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile refresh */}
                <div className="flex justify-center mt-4 md:hidden">
                    <Button onClick={fetchRecommendations} variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-3.5 w-3.5 text-accent" />
                        Refresh Suggestions
                    </Button>
                </div>
            </div>
        </section>
    )
}
