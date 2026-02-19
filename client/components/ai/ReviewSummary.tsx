"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown, Sparkles, Loader2, Quote } from "lucide-react"
import { API_URL } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ReviewSummaryData {
    sentimentScore: number
    pros: string[]
    cons: string[]
    overallVibe: string
}

export function ReviewSummary({ targetId }: { targetId: string }) {
    const [data, setData] = React.useState<ReviewSummaryData | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${API_URL}/ai/reviews/${targetId}/summary`)
                const summary = await response.json()
                if (summary.sentimentScore !== undefined) {
                    setData(summary)
                }
            } catch (error) {
                console.error("Failed to fetch review summary:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSummary()
    }, [targetId])

    if (loading) {
        return (
            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
                <p className="text-sm text-muted-foreground animate-pulse">AI is reading the reviews...</p>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
            <div className="bg-accent/5 p-8 flex flex-col md:flex-row gap-8">
                {/* Sentiment Score */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 md:w-48 shrink-0">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.sentimentScore / 100)}`} className="text-accent transition-all duration-1000 ease-out" />
                        </svg>
                        <span className="absolute text-2xl font-outfit font-bold">{data.sentimentScore}%</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Community Score</span>
                </div>

                {/* Text Summary */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                        <h3 className="text-xl font-outfit font-bold">Community Sentiment</h3>
                    </div>

                    <div className="relative">
                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-accent/10 -z-10" />
                        <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                            "{data.overallVibe}"
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-500">
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">The Bright Side</span>
                            </div>
                            <ul className="space-y-2">
                                {data.pros.map((pro, i) => (
                                    <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-rose-500">
                                <ThumbsDown className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">The Concerns</span>
                            </div>
                            <ul className="space-y-2">
                                {data.cons.map((con, i) => (
                                    <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
