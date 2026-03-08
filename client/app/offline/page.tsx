"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, Home, RefreshCcw, MapPin, Bed, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCachedSavedItems } from "@/lib/offline-db";

export default function OfflinePage() {
    const [savedCounts, setSavedCounts] = useState<{
        places: number;
        stays: number;
        events: number;
    } | null>(null);

    const handleRetry = () => {
        window.location.reload();
    };

    useEffect(() => {
        // Try to find any cached saved items from IndexedDB
        const loadCachedCounts = async () => {
            try {
                // We need userId – try to get from localStorage cached user
                const cachedUserStr = localStorage.getItem("cached_user");
                if (cachedUserStr) {
                    const cachedUser = JSON.parse(cachedUserStr);
                    const userId = cachedUser.id || cachedUser._id;
                    if (userId) {
                        const cached = await getCachedSavedItems(userId);
                        if (cached) {
                            setSavedCounts({
                                places: cached.savedPlaces?.length ?? 0,
                                stays: cached.savedStays?.length ?? 0,
                                events: cached.savedEvents?.length ?? 0,
                            });
                        }
                    }
                }
            } catch {
                // ignore IndexedDB errors
            }
        };
        loadCachedCounts();
    }, []);

    const totalCached = savedCounts
        ? savedCounts.places + savedCounts.stays + savedCounts.events
        : 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <WifiOff className="w-12 h-12 text-amber-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Offline</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                It seems you've lost your connection. Reconnect to continue exploring God's Own Country.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button onClick={handleRetry} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
                <Link href="/">
                    <Button variant="outline" className="px-8 border-teal-600 text-teal-600 hover:bg-teal-50">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </Link>
            </div>

            {/* Cached content section */}
            {savedCounts !== null && totalCached > 0 ? (
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-left">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-rose-500" />
                        <h2 className="font-semibold text-gray-800">Your Cached Wishlist</h2>
                        <span className="ml-auto text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                            {totalCached} saved
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        These items are available offline from your last sync:
                    </p>
                    <div className="space-y-2">
                        {savedCounts.places > 0 && (
                            <Link href="/profile?tab=saved">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-800">Saved Places</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-200 rounded-full px-2 py-0.5">
                                        {savedCounts.places}
                                    </span>
                                </div>
                            </Link>
                        )}
                        {savedCounts.stays > 0 && (
                            <Link href="/profile?tab=saved">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-800">Saved Stays</span>
                                    </div>
                                    <span className="text-xs font-bold text-blue-700 bg-blue-200 rounded-full px-2 py-0.5">
                                        {savedCounts.stays}
                                    </span>
                                </div>
                            </Link>
                        )}
                        {savedCounts.events > 0 && (
                            <Link href="/profile?tab=saved">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-gray-800">Saved Events</span>
                                    </div>
                                    <span className="text-xs font-bold text-purple-700 bg-purple-200 rounded-full px-2 py-0.5">
                                        {savedCounts.events}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-2 text-sm text-gray-400">
                    Tip: Visit your Wishlist while online — it'll be cached here for later!
                </div>
            )}
        </div>
    );
}
