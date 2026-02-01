"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingBreakdown {
    [key: number]: {
        count: number;
        percentage: number;
    };
}

interface ReviewSummaryProps {
    ratingAvg: number;
    ratingCount: number;
    breakdown?: RatingBreakdown;
}

export default function ReviewSummary({ ratingAvg, ratingCount, breakdown }: ReviewSummaryProps) {
    const defaultBreakdown: RatingBreakdown = {
        5: { count: 0, percentage: 0 },
        4: { count: 0, percentage: 0 },
        3: { count: 0, percentage: 0 },
        2: { count: 0, percentage: 0 },
        1: { count: 0, percentage: 0 },
    };

    const displayBreakdown = breakdown || defaultBreakdown;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] mb-20 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors duration-700" />

            {/* Average Rating */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center md:border-r border-gray-100 pr-0 md:pr-12 relative z-10">
                <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 mb-2">
                    {ratingAvg.toFixed(1)}
                </div>
                <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-6 w-6 ${star <= Math.round(ratingAvg) ? "text-yellow-400 fill-yellow-400" : "text-gray-100"}`}
                        />
                    ))}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span className="text-primary font-black">{ratingCount}</span> Verified Reviews
                </div>
            </div>

            {/* Breakdown Bars */}
            <div className="md:col-span-7 flex flex-col gap-4 relative z-10 w-full">
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-6 group/item">
                        <div className="flex items-center gap-1.5 w-14 shrink-0 transition-transform group-hover/item:scale-110">
                            <span className="text-sm font-black text-gray-800">{star}</span>
                            <Star className="h-4 w-4 text-gray-300 fill-gray-300" />
                        </div>
                        <div className="flex-1 h-3.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.3)] transition-all duration-1000 ease-out"
                                style={{ width: `${displayBreakdown[star].percentage}%` }}
                            />
                        </div>
                        <div className="w-16 text-right text-xs font-black text-gray-400 shrink-0 group-hover/item:text-primary transition-colors">
                            {displayBreakdown[star].percentage}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
