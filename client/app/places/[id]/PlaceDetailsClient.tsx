"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { placeService } from "@/services/placeService"
import { Button } from "@/components/ui/button"
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
    MapPin,
    Star,
    Share2,
    Heart,
    ChevronLeft,
} from "lucide-react"
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/app/components/Map/LeafletMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-3xl" />
});
import toast from "react-hot-toast"
import ReviewSection from "@/components/reviews/ReviewSection"

// New Premium Components
import PlaceWeather from "@/app/components/places/PlaceWeather"
import PlaceGallery from "@/app/components/places/PlaceGallery"
import QuickInfoPanel from "@/app/components/places/QuickInfoPanel"
import StickyMiniHeader from "@/app/components/places/StickyMiniHeader"
import PlacePhotoGallery from "@/components/places/PlacePhotoGallery";
import { Container } from "@/components/ui/container";
import { getFullImageUrl } from "@/lib/images";
import { trackPlaceView, trackBookmark } from "@/lib/interactionTracker";

export default function PlaceDetailsClient({ placeId, initialPlace }: { placeId: string, initialPlace?: any }) {
    const router = useRouter()
    const { user, updateUser } = useAuth()

    const [place, setPlace] = useState<any>(initialPlace || null);
    const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(!initialPlace);
    const [weather, setWeather] = useState<any>(null)
    const [userPhotos, setUserPhotos] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [addedToItinerary, setAddedToItinerary] = useState(false)

    // Helper functions
    const fetchUserPhotos = async () => {
        try {
            const res = await api.get(`/place-photos/${placeId}`);
            if (res.data.success) {
                setUserPhotos(res.data.data);
            }
        } catch (e) {
            console.error("User photos fetch failed", e);
        }
    };

    const handleToggleSave = async () => {
        if (!user) {
            toast.error("Please login to save places");
            router.push("/login");
            return;
        }

        try {
            if (isFavorite) {
                await api.delete(`/users/save/place/${placeId}`);
                toast.success("Removed from saved places");
                const newSaved = user.savedPlaces?.filter((p: any) => {
                    const savedId = typeof p === 'string' ? p : p._id;
                    return savedId !== placeId;
                });
                updateUser({ savedPlaces: newSaved });
            } else {
                await api.post(`/users/save/place/${placeId}`);
                toast.success("Added to saved places");
                const newSaved = [...(user.savedPlaces || []), placeId];
                updateUser({ savedPlaces: newSaved });
                trackBookmark(placeId, place?.category || '', place?.district || '');
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast.error("Failed to update saved places");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: place?.name,
                text: place?.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        }
    }

    const handleAddToItinerary = () => {
        setAddedToItinerary(true)
        toast.success("Added to itinerary!")
        setTimeout(() => router.push("/plan-trip"), 1000)
    }

    // Effects
    useEffect(() => {
        if (!placeId) return;

        const fetchData = async () => {
            try {
                if (!initialPlace) setLoading(true);

                // Concurrent fetches
                fetchUserPhotos();

                if (!initialPlace) {
                    const placeData = await placeService.getById(placeId);
                    if (placeData && placeData.success) {
                        setPlace(placeData.data);
                    } else {
                        toast.error("Place not found");
                    }
                }

                try {
                    const nearbyData = await placeService.getNearby(placeId);
                    if (nearbyData.success) setNearbyPlaces(nearbyData.data);
                } catch (e) { console.error("Nearby fetch failed", e); }

            } catch (error) {
                console.error("Critical error loading place:", error);
                toast.error("Failed to load place details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [placeId, initialPlace]);

    // Tracking effect
    useEffect(() => {
        if (place?._id) {
            trackPlaceView(place._id, place.category, place.district, place.tags || []);
        }
    }, [place?._id]);

    // Favorite status effect
    useEffect(() => {
        const isPlaceSaved = user?.savedPlaces?.some((p: any) => {
            const savedId = typeof p === 'string' ? p : p._id;
            return savedId === placeId;
        });
        setIsFavorite(!!isPlaceSaved);
    }, [user, placeId]);

    // Weather effect
    useEffect(() => {
        if (place?.latitude && place?.longitude) {
            async function fetchWeather() {
                try {
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`
                    )
                    const data = await res.json()
                    setWeather(data.current_weather)
                } catch (err) {
                    console.error("Weather fetch failed:", err)
                }
            }
            fetchWeather()
        }
    }, [place?.latitude, place?.longitude]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-gray-500 font-medium">Loading destination...</p>
                </div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background">
                <div className="text-6xl mb-6">🏜️</div>
                <h1 className="text-4xl font-black">Location Not Found</h1>
                <p className="text-muted-foreground mt-2 mb-8 max-w-sm text-center">We couldn't locate this destination in our database.</p>
                <Link href="/explore">
                    <Button className="bg-primary text-primary-foreground px-8 rounded-full">Explore All Destinations</Button>
                </Link>
            </div>
        )
    }

    const allImages = [...(place.images || []), ...(userPhotos.map(p => p.image))];
    const images = (allImages.length > 0 ? allImages : [null]).map((img: string | null) => getFullImageUrl(img, place.name, place.category, undefined, place.updatedAt));

    return (
        <main className="min-h-screen bg-white">
            <StickyMiniHeader
                place={place}
                isFavorite={isFavorite}
                onToggleSave={handleToggleSave}
                onShare={handleShare}
            />

            {/* HERO SECTION */}
            <div className="relative h-[95vh] w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={getFullImageUrl(place.image || (place.images && place.images[0]), place.name, place.category, undefined, place.updatedAt)}
                        alt={place.name}
                        className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
                    <Link href="/explore">
                        <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-14 w-14 p-0 backdrop-blur-md border border-white/10">
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                    </Link>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleToggleSave}
                            className={`h-14 w-14 p-0 rounded-full transition-all backdrop-blur-md border border-white/10 ${isFavorite ? "bg-white text-destructive" : "bg-white/10 text-white hover:bg-white/20"}`}
                        >
                            <Heart className={`h-7 w-7 ${isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                            onClick={handleShare}
                            className="h-14 w-14 p-0 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-full hover:bg-white/20"
                        >
                            <Share2 className="h-7 w-7" />
                        </Button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 py-20 px-8 md:px-16 lg:px-24 z-20">
                    <div className="container mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-end">
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-[0.3em]">
                                        {place.category}
                                    </span>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 text-sm font-black text-white">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        {place.ratingAvg} <span className="text-white/40 ml-1 font-medium">({place.ratingCount || 0} Reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
                                    {place.name}
                                </h1>

                                <div className="flex items-center gap-3 text-white/80 text-xl font-medium">
                                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-md">
                                        <MapPin className="h-6 w-6 text-accent" />
                                    </div>
                                    <span className="tracking-tight">{place.district}, Kerala</span>
                                </div>
                            </div>

                            <div className="hidden lg:flex justify-end animate-fade-in-up delay-200">
                                {weather && <PlaceWeather weather={weather} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Container size="xl" className="py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
                    <div className="lg:col-span-8 space-y-24">
                        <section className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Visual Journey</h2>
                                <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">Exquisite captures from around {place.name}</p>
                            </div>
                            <PlaceGallery images={images} name={place.name} />
                        </section>

                        <section className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-8">
                                <h2 className="text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                                    The Story of <br /><span className="text-primary">{place.name}</span>
                                </h2>
                                <div className="w-24 h-2 bg-primary/20 rounded-full" />
                                <div className="text-xl text-gray-600 leading-relaxed font-medium space-y-6">
                                    {place.description.split('\n').map((para: string, i: number) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                                <h3 className="text-2xl font-black text-gray-900">Highlights</h3>
                                <ul className="space-y-6">
                                    {["Natural Beauty", "Cultural Heritage", "Photography Spots", "Trekking Trails"].map((h, i) => (
                                        <li key={i} className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <div className="h-2 w-2 bg-primary rounded-full" />
                                            </div>
                                            <span className="font-bold text-gray-700">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Getting There</h2>
                                    <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">{place.district}</p>
                                </div>
                                <Button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, '_blank')}
                                    className="bg-gray-900 text-white hover:bg-black px-8 h-14 rounded-2xl font-bold flex gap-3 shadow-2xl shrink-0"
                                >
                                    <MapPin className="h-5 w-5" />
                                    Open in Google Maps
                                </Button>
                            </div>
                            <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-xl relative">
                                <LeafletMap
                                    center={[place.latitude || 10, place.longitude || 76]}
                                    zoom={13}
                                    markers={[{ lat: place.latitude, lng: place.longitude, title: place.name }]}
                                    height="600px"
                                />
                            </div>
                        </section>

                        <PlacePhotoGallery
                            targetId={place._id}
                            targetName={place.name}
                            externalPhotos={userPhotos}
                            onUpdate={fetchUserPhotos}
                        />

                        <ReviewSection
                            targetId={placeId}
                            targetType="place"
                            initialRatingAvg={place.ratingAvg}
                            initialRatingCount={place.ratingCount}
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-12 relative">
                        <div className="sticky top-32 space-y-12 self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                            <QuickInfoPanel place={place} />

                            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white space-y-8 border border-white/10">
                                <h3 className="text-3xl font-black tracking-tight">Plan Your Journey</h3>
                                <Button onClick={handleAddToItinerary} className="w-full h-20 bg-primary text-primary-foreground rounded-2xl font-black text-xl shadow-lg">
                                    {addedToItinerary ? "Saved to Plan" : "Add to Itinerary"}
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter px-2">Explore Beyond</h3>
                                <div className="grid gap-6">
                                    {nearbyPlaces.map(np => (
                                        <Link key={np._id} href={`/places/${np._id}`} className="group block">
                                            <div className="bg-white hover:bg-gray-50 rounded-3xl p-5 transition-all border border-gray-100 flex gap-6">
                                                <div className="h-24 w-24 rounded-[1.5rem] overflow-hidden shrink-0 shadow-lg relative">
                                                    <img src={getFullImageUrl(np.image, np.name, np.category, undefined, np.updatedAt)} className="h-full w-full object-cover" alt={np.name} />
                                                </div>
                                                <div className="flex flex-col justify-center gap-1.5">
                                                    <h4 className="font-black text-gray-900 text-lg line-clamp-1">{np.name}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs font-black">{np.ratingAvg}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{np.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    )
}
