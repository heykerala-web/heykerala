"use client";

import { Clock, Banknote, Calendar, ShieldCheck, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickInfoPanelProps {
    place: {
        bestTimeToVisit?: string;
        entryFee?: string | number;
        openingHours?: string;
        category?: string;
    };
}

export default function QuickInfoPanel({ place }: QuickInfoPanelProps) {
    const items = [
        {
            icon: <Calendar className="h-5 w-5 text-emerald-500" />,
            label: "Best Time",
            value: place.bestTimeToVisit || "Sep - Mar",
        },
        {
            icon: <Banknote className="h-5 w-5 text-amber-500" />,
            label: "Entry Fee",
            value: typeof place.entryFee === 'number' ? `₹${place.entryFee}` : (place.entryFee || "Free Entry"),
        },
        {
            icon: <Clock className="h-5 w-5 text-blue-500" />,
            label: "Hours",
            value: place.openingHours || "09:00 AM - 06:00 PM",
        },
        {
            icon: <Tag className="h-5 w-5 text-purple-500" />,
            label: "Category",
            value: place.category || "Sightseeing",
        },
    ];

    return (
        <Card className="rounded-[2.5rem] border-0 bg-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Essential Info</h3>
                </div>

                <div className="grid gap-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                                {item.icon}
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-black mb-0.5">
                                    {item.label}
                                </p>
                                <p className="font-bold text-gray-800 tracking-tight">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                            <span className="font-bold">Traveler Tip:</span> Arrive early to avoid crowds and enjoy the best lighting for photography.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
