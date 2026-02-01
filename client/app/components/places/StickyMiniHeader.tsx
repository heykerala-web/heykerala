"use client";

import { useState, useEffect } from "react";
import { Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyMiniHeaderProps {
    place: {
        name: string;
        ratingAvg: number;
        _id: string;
    };
    isFavorite: boolean;
    onToggleSave: () => void;
    onShare: () => void;
}

export default function StickyMiniHeader({
    place,
    isFavorite,
    onToggleSave,
    onShare
}: StickyMiniHeaderProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past hero (approx 600px)
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {place.name}
                    </h2>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-700">{place.ratingAvg}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={onToggleSave}
                        variant="ghost"
                        className={`rounded-full h-11 w-11 p-0 ${isFavorite ? "text-destructive" : "text-gray-400"}`}
                    >
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                        onClick={onShare}
                        variant="ghost"
                        className="rounded-full h-11 w-11 p-0 text-gray-400"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                        className="hidden sm:flex bg-primary text-primary-foreground font-bold px-8 rounded-full h-11 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Plan Your Trip
                    </Button>
                </div>
            </div>
        </div>
    );
}
