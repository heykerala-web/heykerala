"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Flame, Eye, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { eventService, Event } from "@/services/eventService";
import { getFullImageUrl } from "@/lib/images";
import { EventStatusBadge } from "./EventStatusBadge";

export function TrendingEventsSection() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        eventService.getTrending()
            .then(res => { if (res?.success) setEvents(res.data || []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const scroll = (dir: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
        }
    };

    if (!loading && events.length === 0) return null;

    return (
        <section>
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                        <Flame className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-outfit font-black text-gray-900 tracking-tight">Trending Now</h2>
                        <p className="text-gray-500 text-sm font-medium">Most viewed &amp; bookmarked events</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    <button onClick={() => scroll("left")} className="p-2 rounded-full border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={() => scroll("right")} className="p-2 rounded-full border border-gray-200 hover:border-teal-400 hover:bg-teal-50 transition">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-shrink-0 w-72 h-80 rounded-3xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
                    {events.map((ev, idx) => (
                        <Link key={ev._id} href={`/events/${ev._id}`} className="flex-shrink-0 w-72 group block">
                            <div className="relative rounded-3xl overflow-hidden h-80 bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <img
                                    src={getFullImageUrl(ev.images?.[0], ev.title, ev.category)}
                                    alt={ev.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Rank badge */}
                                <div className={`absolute top-4 left-4 h-9 w-9 rounded-full flex items-center justify-center font-black text-sm shadow-lg
                  ${idx === 0 ? "bg-amber-400 text-amber-900" : idx === 1 ? "bg-gray-300 text-gray-700" : idx === 2 ? "bg-orange-400 text-orange-900" : "bg-black/40 text-white"}
                `}>
                                    {idx + 1}
                                </div>

                                {/* Status */}
                                <div className="absolute top-4 right-4">
                                    <EventStatusBadge status={ev.eventStatus} />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
                                        {ev.category}
                                    </span>
                                    <h3 className="text-white font-black text-lg leading-tight line-clamp-2 mb-2 group-hover:text-teal-300 transition">
                                        {ev.title}
                                    </h3>
                                    <p className="text-white/60 text-xs mb-3">📍 {ev.venue}, {ev.district}</p>

                                    {/* Stats row */}
                                    <div className="flex items-center gap-3 text-white/70 text-xs font-bold">
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {ev.viewCount > 999 ? `${(ev.viewCount / 1000).toFixed(1)}k` : ev.viewCount || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Bell className="h-3 w-3" />
                                            {ev.reminderCount || 0}
                                        </span>
                                        <span className="ml-auto text-teal-300">
                                            {new Date(ev.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
