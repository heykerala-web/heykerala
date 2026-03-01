"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { eventService, Event } from "@/services/eventService";
import { getFullImageUrl } from "@/lib/images";
import { EventStatusBadge } from "./EventStatusBadge";

export function AIEventRecommendations() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<string>("ai");

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { setLoading(false); return; }

        eventService.getAIRecommendations()
            .then(res => {
                if (res?.success) {
                    setEvents(res.data || []);
                    setSource(res.source || "ai");
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Don't render if no user or no events
    if (!loading && events.length === 0) return null;

    return (
        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-outfit font-black text-gray-900 tracking-tight">
                        For You
                        {source === "ai" && (
                            <span className="ml-3 text-xs font-black bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full uppercase tracking-widest">AI Picks</span>
                        )}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Personalized based on your interests</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin mr-3 text-violet-500" />
                    <span className="text-sm font-medium">AI is picking events for you…</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {events.map(ev => (
                        <Link key={ev._id} href={`/events/${ev._id}`} className="group block">
                            <div className="relative rounded-3xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
                                <img
                                    src={getFullImageUrl(ev.images?.[0], ev.title, ev.category)}
                                    alt={ev.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* AI sparkle badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="bg-violet-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                                        <Sparkles className="h-2.5 w-2.5" /> AI Pick
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <EventStatusBadge status={ev.eventStatus} />
                                    <h3 className="text-white font-black text-sm leading-tight mt-1.5 line-clamp-2 group-hover:text-violet-300 transition">
                                        {ev.title}
                                    </h3>
                                    <p className="text-white/60 text-[10px] mt-1">
                                        📍 {ev.district} · {new Date(ev.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
