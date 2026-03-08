"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { PlaceCard } from "../place-card";
import { StayCard } from "../StayCard";
import { EventCard } from "../event-card";
import { Loader2, Heart, MapPin, Bed, Calendar, WifiOff, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cacheSavedItems, getCachedSavedItems } from "@/lib/offline-db";

export default function SavedItems() {
    const { user } = useAuth();
    const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
    const [savedStays, setSavedStays] = useState<any[]>([]);
    const [savedEvents, setSavedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [cachedAt, setCachedAt] = useState<number | null>(null);
    const [hasCache, setHasCache] = useState(false);

    const userId = user?.id || user?._id || "guest";

    const loadFromCache = async () => {
        try {
            const cached = await getCachedSavedItems(userId);
            if (cached) {
                setSavedPlaces(cached.savedPlaces || []);
                setSavedStays(cached.savedStays || []);
                setSavedEvents(cached.savedEvents || []);
                setCachedAt(cached.cachedAt);
                setHasCache(true);
            }
        } catch (err) {
            console.warn("[SavedItems] Failed to load from IndexedDB cache:", err);
        }
    };

    const fetchSaved = async () => {
        try {
            setLoading(true);

            // If offline, immediately load from cache
            if (!navigator.onLine) {
                setIsOffline(true);
                await loadFromCache();
                setLoading(false);
                return;
            }

            const { data } = await api.get("/users/saved");
            if (data.success) {
                const places = data.savedPlaces || [];
                const stays = data.savedStays || [];
                const events = data.savedEvents || [];

                setSavedPlaces(places);
                setSavedStays(stays);
                setSavedEvents(events);
                setIsOffline(false);
                setCachedAt(null);

                // Cache the fresh data in IndexedDB for offline use
                try {
                    await cacheSavedItems(userId, { savedPlaces: places, savedStays: stays, savedEvents: events });
                } catch (cacheErr) {
                    console.warn("[SavedItems] Failed to cache data:", cacheErr);
                }
            }
        } catch (error: any) {
            const offline = !navigator.onLine || error.message === "Network Error" || error.code === "ERR_NETWORK";
            if (offline) {
                setIsOffline(true);
                await loadFromCache();
            } else {
                toast.error("Failed to fetch wishlist");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();

        const handleOnline = () => {
            setIsOffline(false);
            fetchSaved(); // Re-fetch fresh data when connection is restored
        };
        const handleOffline = () => {
            setIsOffline(true);
            loadFromCache();
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [userId]);

    const handleUnsave = async (type: string, id: string) => {
        try {
            const { data } = await api.delete(`/users/save/${type}/${id}`);
            if (data.success) {
                if (type === "place") setSavedPlaces((prev) => prev.filter((p) => p._id !== id));
                if (type === "stay") setSavedStays((prev) => prev.filter((s) => s._id !== id));
                if (type === "event") setSavedEvents((prev) => prev.filter((e) => e._id !== id));
                toast.success("Removed from wishlist");
            }
        } catch {
            toast.error("Failed to unsave");
        }
    };

    const formatCacheAge = (timestamp: number) => {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return "just now";
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );

    const totalSaved = savedPlaces.length + savedStays.length + savedEvents.length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                    <h2 className="text-2xl font-bold">Your Wishlist</h2>
                    <p className="text-muted-foreground">Everything you've saved for your Kerala adventure.</p>
                </div>
                {isOffline && (
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-sm">
                            <WifiOff className="w-3 h-3" />
                            You're offline
                        </div>
                        {cachedAt ? (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Showing data cached {formatCacheAge(cachedAt)}
                            </div>
                        ) : (
                            <div className="text-xs text-red-500">No cached data — go online to load your wishlist</div>
                        )}
                    </div>
                )}
            </div>

            {/* No cache + offline message */}
            {isOffline && !hasCache && totalSaved === 0 ? (
                <div className="text-center py-20 animate-in fade-in duration-700">
                    <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <WifiOff className="w-10 h-10 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">You're Offline</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                        Your wishlist hasn't been cached yet. Connect to the internet once to save your wishlist for offline viewing.
                    </p>
                </div>
            ) : (
                <>
                    <Tabs defaultValue="places" className="w-full">
                        <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-100 mb-10 w-full sm:w-auto inline-flex h-auto gap-2">
                            <TabsTrigger
                                value="places"
                                className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                <MapPin className="w-4 h-4 mr-2" /> Places{" "}
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedPlaces.length}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="stays"
                                className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                <Bed className="w-4 h-4 mr-2" /> Stays{" "}
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedStays.length}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                            >
                                <Calendar className="w-4 h-4 mr-2" /> Events{" "}
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedEvents.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="places">
                            {savedPlaces.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedPlaces.map((place) => (
                                        <PlaceCard
                                            key={place._id}
                                            id={place._id}
                                            name={place.name}
                                            location={place.location}
                                            image={place.image || place.images?.[0]}
                                            rating={place.rating || 0}
                                            description={place.description}
                                            category={place.category}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed">
                                    <p className="text-muted-foreground">No places saved yet.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="stays">
                            {savedStays.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedStays.map((stay) => (
                                        <StayCard
                                            key={stay._id}
                                            id={stay._id}
                                            name={stay.name}
                                            type={stay.type}
                                            district={stay.district}
                                            image={stay.images?.[0] || stay.image}
                                            rating={stay.ratingAvg || stay.rating}
                                            price={stay.price}
                                            amenities={stay.amenities}
                                            isSaved={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed">
                                    <p className="text-muted-foreground">No stays saved yet.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="events">
                            {savedEvents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedEvents.map((event) => (
                                        <EventCard
                                            key={event._id}
                                            id={event._id}
                                            name={event.title || event.name}
                                            date={new Date(event.startDate || event.date).toLocaleDateString()}
                                            time={event.time}
                                            location={event.venue || event.location}
                                            image={event.images?.[0] || event.image}
                                            description={event.description}
                                            category={event.category}
                                            isBookmarked={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed">
                                    <p className="text-muted-foreground">No events saved yet.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    {totalSaved === 0 && !isOffline && (
                        <div className="text-center py-20 animate-in fade-in duration-700">
                            <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                Tap the heart on any place, stay or event to save it for your dream trip.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
