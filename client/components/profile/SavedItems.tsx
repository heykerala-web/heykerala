"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { PlaceCard } from "../place-card";
import { StayCard } from "../StayCard";
import { EventCard } from "../event-card";
import { Loader2, Heart, MapPin, Bed, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavedItems() {
    const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
    const [savedStays, setSavedStays] = useState<any[]>([]);
    const [savedEvents, setSavedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    const fetchSaved = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/users/saved");
            if (data.success) {
                setSavedPlaces(data.savedPlaces || []);
                setSavedStays(data.savedStays || []);
                setSavedEvents(data.savedEvents || []);
                setIsOffline(false);
            }
        } catch (error: any) {
            // Check if we are offline or if it's a network error
            if (!navigator.onLine || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                setIsOffline(true);
                // If we have cached data, it will be returned by the service worker
                // but if we are here, the axios call failed (maybe no cache yet or service worker intercept failed)
            } else {
                toast.error("Failed to fetch wishlist");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // We keep handleUnsave for the Stay and Event cards if they don't handle it perfectly yet,
    // but we'll try to rely on the cards' own logic mostly.
    const handleUnsave = async (type: string, id: string) => {
        try {
            const { data } = await api.delete(`/users/save/${type}/${id}`);
            if (data.success) {
                if (type === 'place') setSavedPlaces(prev => prev.filter(p => p._id !== id));
                if (type === 'stay') setSavedStays(prev => prev.filter(s => s._id !== id));
                if (type === 'event') setSavedEvents(prev => prev.filter(e => e._id !== id));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            toast.error("Failed to unsave");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    const totalSaved = savedPlaces.length + savedStays.length + savedEvents.length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold">Your Wishlist</h2>
                    <p className="text-muted-foreground">Everything you've saved for your Kerala adventure.</p>
                </div>
                {isOffline && (
                    <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1.5 shadow-sm">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        Viewing Offline
                    </div>
                )}
            </div>

            <Tabs defaultValue="places" className="w-full">
                <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-100 mb-10 w-full sm:w-auto inline-flex h-auto gap-2">
                    <TabsTrigger value="places" className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                        <MapPin className="w-4 h-4 mr-2" /> Places <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedPlaces.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="stays" className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                        <Bed className="w-4 h-4 mr-2" /> Stays <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedStays.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="events" className="rounded-full px-6 py-3 text-sm font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                        <Calendar className="w-4 h-4 mr-2" /> Events <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-[10px]">{savedEvents.length}</span>
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

            {totalSaved === 0 && (
                <div className="text-center py-20 animate-in fade-in duration-700">
                    <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">Tap the heart on any place, stay or event to save it for your dream trip.</p>
                </div>
            )}
        </div>
    );
}
