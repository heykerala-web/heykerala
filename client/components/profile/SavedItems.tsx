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

    const fetchSaved = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/users/saved");
            if (data.success) {
                setSavedPlaces(data.savedPlaces || []);
                setSavedStays(data.savedStays || []);
                setSavedEvents(data.savedEvents || []);
            }
        } catch (error) {
            toast.error("Failed to fetch wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

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

    if (totalSaved === 0) return (
        <div className="text-center py-20">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">Your wishlist is empty</h3>
            <p className="text-muted-foreground">Tap the heart on any place, stay or event to save it for later.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">Your Wishlist</h2>
                <p className="text-muted-foreground">Everything you've saved for your Kerala adventure.</p>
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
                                <div key={place._id} className="relative group">
                                    <PlaceCard
                                        id={place._id}
                                        name={place.name}
                                        location={place.location}
                                        image={place.image || place.images?.[0]}
                                        rating={place.rating || 0}
                                        description={place.description}
                                        category={place.category}
                                    />
                                    <button
                                        onClick={() => handleUnsave('place', place._id)}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                                    >
                                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                                    </button>
                                </div>
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
                                <div key={stay._id} className="relative group">
                                    <StayCard
                                        id={stay._id}
                                        name={stay.name}
                                        type={stay.type}
                                        district={stay.district}
                                        image={stay.images?.[0] || stay.image}
                                        rating={stay.ratingAvg || stay.rating}
                                        price={stay.price}
                                        amenities={stay.amenities}
                                    />
                                    <button
                                        onClick={() => handleUnsave('stay', stay._id)}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                                    >
                                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                                    </button>
                                </div>
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
                                <div key={event._id} className="relative group">
                                    <EventCard
                                        id={event._id}
                                        name={event.title || event.name}
                                        date={new Date(event.startDate || event.date).toLocaleDateString()}
                                        time={event.time}
                                        location={event.venue || event.location}
                                        image={event.images?.[0] || event.image}
                                        description={event.description}
                                        category={event.category}
                                    />
                                    <button
                                        onClick={() => handleUnsave('event', event._id)}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                                    >
                                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-secondary/10 rounded-3xl border border-dashed">
                            <p className="text-muted-foreground">No events saved yet.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
