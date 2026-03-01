"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { eventService, Event } from "@/services/eventService";
import { EventStatusBadge } from "./EventStatusBadge";
import { getFullImageUrl } from "@/lib/images";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_COLORS: Record<string, string> = {
    Festival: "bg-orange-400",
    Cultural: "bg-purple-400",
    Music: "bg-pink-400",
    Food: "bg-yellow-400",
    Workshop: "bg-blue-400",
    Sports: "bg-green-400",
    Other: "bg-gray-400",
};

interface Props {
    district?: string;
}

export function EventCalendar({ district }: Props) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1); // 1-based
    const [calendarData, setCalendarData] = useState<Record<string, Event[]>>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await eventService.getCalendarEvents(month, year, district);
                if (res?.success) setCalendarData(res.data || {});
            } catch { /* silent */ }
            finally { setLoading(false); }
        };
        fetch();
        setSelectedDate(null);
    }, [month, year, district]);

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    // Build grid
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const todayStr = now.toISOString().split("T")[0];

    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    // pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null);

    const dateKey = (day: number) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const selectedEvents = selectedDate ? (calendarData[selectedDate] || []) : [];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar grid */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-full transition">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-black tracking-tight">{MONTHS[month - 1]}</h2>
                        <p className="text-teal-200 text-sm">{year}</p>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-full transition">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                    {DAYS.map(d => (
                        <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse">Loading calendar…</div>
                ) : (
                    <div className="grid grid-cols-7">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} className="min-h-[80px] border-b border-r border-gray-50" />;
                            const key = dateKey(day);
                            const events = calendarData[key] || [];
                            const isToday = key === todayStr;
                            const isSelected = key === selectedDate;
                            const isPast = new Date(key) < new Date(todayStr);

                            return (
                                <div
                                    key={key}
                                    onClick={() => setSelectedDate(isSelected ? null : key)}
                                    className={`min-h-[80px] p-2 border-b border-r border-gray-50 cursor-pointer transition-colors
                    ${isSelected ? "bg-teal-50" : "hover:bg-gray-50"}
                    ${isPast ? "opacity-60" : ""}
                  `}
                                >
                                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold mb-1
                    ${isToday ? "bg-teal-600 text-white" : isSelected ? "bg-teal-100 text-teal-700" : "text-gray-700"}
                  `}>
                                        {day}
                                    </span>
                                    {/* Event dots / labels */}
                                    <div className="space-y-0.5">
                                        {events.slice(0, 2).map((e, i) => (
                                            <div
                                                key={e._id + i}
                                                className={`w-full text-[8px] font-bold text-white rounded px-1 py-0.5 truncate ${CATEGORY_COLORS[e.category] || "bg-gray-400"}`}
                                            >
                                                {e.title}
                                            </div>
                                        ))}
                                        {events.length > 2 && (
                                            <div className="text-[8px] text-teal-600 font-black pl-1">+{events.length - 2} more</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Event panel */}
            <div className="lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center text-gray-400">
                        <span className="text-5xl mb-4">📅</span>
                        <p className="font-bold text-gray-500">Click a date to see events</p>
                        <p className="text-sm mt-1">Colored dots show event days</p>
                    </div>
                ) : (
                    <>
                        <div className="px-5 py-4 border-b border-gray-100 bg-teal-50">
                            <p className="text-xs font-black uppercase tracking-widest text-teal-600">Events on</p>
                            <p className="font-black text-gray-900 text-lg">
                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <div className="divide-y divide-gray-50 overflow-y-auto max-h-[500px]">
                            {selectedEvents.length === 0 ? (
                                <p className="py-10 text-center text-gray-400 text-sm">No events on this date</p>
                            ) : (
                                selectedEvents.map(ev => (
                                    <Link key={ev._id} href={`/events/${ev._id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition group">
                                        <img
                                            src={getFullImageUrl(ev.images?.[0], ev.title, ev.category)}
                                            alt={ev.title}
                                            className="h-14 w-14 rounded-2xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-gray-900 truncate group-hover:text-teal-600 transition">{ev.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {ev.venue}, {ev.district}</p>
                                            <div className="mt-1">
                                                <EventStatusBadge status={ev.eventStatus} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
