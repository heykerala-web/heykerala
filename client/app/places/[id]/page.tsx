"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { placeService } from "@/services/placeService"
import { reviewService } from "@/services/reviewService"
import { Button } from "@/components/ui/button"
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Star,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Wind,
  Droplets
} from "lucide-react"
import LeafletMap from "@/app/components/Map/LeafletMap"
import toast from "react-hot-toast"
import PlaceCard from "@/components/places/PlaceCard"
import ReviewList from "@/components/reviews/ReviewList"
import ReviewForm from "@/components/reviews/ReviewForm"
import ReviewSummary from "@/components/reviews/ReviewSummary"
import { Review } from "@/types/review"

// New Premium Components
import PlaceWeather from "@/app/components/places/PlaceWeather"
import PlaceGallery from "@/app/components/places/PlaceGallery"
import QuickInfoPanel from "@/app/components/places/QuickInfoPanel"
import StickyMiniHeader from "@/app/components/places/StickyMiniHeader"
import PlacePhotoGallery from "@/components/places/PlacePhotoGallery";

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // const { id } = useParams() as { id?: string | string[] }
  const placeId = params.id;

  const [place, setPlace] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [isFetchingReviews, setIsFetchingReviews] = useState(false);
  const [reviewBreakdown, setReviewBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [addedToItinerary, setAddedToItinerary] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false);

  const { user, updateUser } = useAuth()

  // Fetch Place, Reviews & Nearby
  useEffect(() => {
    if (!placeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching place with ID:", placeId);

        // Reset states to avoid stale data flash
        setPlace(null);
        setNearbyPlaces([]);
        setReviews([]);
        setReviewPage(1);

        const placeData = await placeService.getById(placeId);

        if (placeData && placeData.success) {
          setPlace(placeData.data);

          // Fetch Reviews & Breakdown
          fetchReviews(1, true);
          fetchBreakdown();

          // Fetch Nearby
          try {
            const nearbyData = await placeService.getNearby(placeId);
            if (nearbyData.success) setNearbyPlaces(nearbyData.data);
          } catch (e) { console.error("Nearby fetch failed", e); }

        } else {
          console.error("Place fetch failed:", placeData);
          toast.error("Place not found");
          setPlace(null);
        }
      } catch (error) {
        console.error("Critical error loading place:", error);
        toast.error("Failed to load place details");
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId]);

  const fetchReviews = async (page = 1, reset = false) => {
    try {
      setIsFetchingReviews(true);
      const res = await reviewService.getReviews(placeId, page, 5);
      if (res.success) {
        if (reset) {
          setReviews(res.data);
        } else {
          setReviews(prev => [...prev, ...res.data]);
        }
        setTotalReviews(res.pagination.total);
        setHasMoreReviews(page < res.pagination.pages);
        setReviewPage(page);
      }
    } catch (e) {
      console.error("Reviews fetch failed", e);
    } finally {
      setIsFetchingReviews(false);
    }
  };

  const fetchBreakdown = async () => {
    try {
      const res = await reviewService.getRatingBreakdown(placeId);
      if (res.success) setReviewBreakdown(res.data.breakdown);
    } catch (e) { console.error("Breakdown fetch failed", e); }
  }

  // Check Favorite Status
  const isPlaceSaved = user?.savedPlaces?.some((p: any) => {
    const savedId = typeof p === 'string' ? p : p._id;
    return savedId === placeId;
  });
  useEffect(() => {
    setIsFavorite(!!isPlaceSaved);
  }, [user, placeId, isPlaceSaved]);

  // Weather Fetch
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
  }, [place]);

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
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("Failed to update saved places");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: place.description,
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

  const handleReviewChanged = (updatedReview: any) => {
    fetchReviews(1, true);
    fetchBreakdown();

    // Update place rating visually
    if (updatedReview.ratingInfo) {
      setPlace((prev: any) => ({
        ...prev,
        ratingAvg: updatedReview.ratingInfo.ratingAvg,
        ratingCount: updatedReview.ratingInfo.ratingCount
      }));
    }
  }

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
        <h1 className="text-h2 font-semibold">Location Not Found</h1>
        <p className="text-muted-foreground mt-2 mb-8 max-w-sm text-center">We couldn't locate this destination in our database. It might have been moved or removed.</p>
        <div className="flex gap-4">
          <Link href="/explore">
            <Button className="bg-primary text-primary-foreground px-8 rounded-full">Explore All Destinations</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = place.images?.length > 0 ? place.images : [place.image || "/placeholder.svg"];

  return (
    <main className="min-h-screen bg-white">
      <StickyMiniHeader
        place={place}
        isFavorite={isFavorite}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
      />

      {/* CINEMATIC HERO SECTION */}
      <div className="relative h-[95vh] w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={images[0]}
            alt={place.name}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          {/* Deep Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        {/* Action Bar */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
          <Link href="/explore">
            <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-14 w-14 p-0 backdrop-blur-md border border-white/10">
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button
              onClick={handleToggleSave}
              className={`h-14 w-14 p-0 rounded-full transition-all backdrop-blur-md border border-white/10 ${isFavorite ? "bg-white text-destructive shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "bg-white/10 text-white hover:bg-white/20"}`}
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

        {/* Place Info Header Overlay */}
        <div className="absolute bottom-0 left-0 right-0 py-20 px-8 md:px-16 lg:px-24 z-20">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 text-sm font-black text-white">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {place.ratingAvg} <span className="text-white/40 ml-1 font-medium">({totalReviews} Reviews)</span>
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

              {/* Weather Overlay */}
              <div className="hidden lg:flex justify-end animate-fade-in-up delay-200">
                {weather && <PlaceWeather weather={weather} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">

          {/* LEFT: Main Content */}
          <div className="lg:col-span-8 space-y-24">

            {/* Image Gallery */}
            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Visual Journey</h2>
                  <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">Exquisite captures from {place.name}</p>
                </div>
              </div>
              <PlaceGallery images={images} name={place.name} />
            </section>

            {/* About Section - Story Layout */}
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
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Safety & Care</p>
                  <p className="text-gray-500 font-medium leading-relaxed">Please respect local customs and help maintain the cleanliness of this beautiful destination.</p>
                </div>
              </div>
            </section>

            {/* Map Section */}
            <section className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Getting There</h2>
                  <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">{place.location}</p>
                </div>
                <Button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, '_blank')}
                  className="bg-gray-900 text-white hover:bg-black px-8 h-14 rounded-2xl font-bold flex gap-3 shadow-2xl"
                >
                  <MapPin className="h-5 w-5" />
                  Open in Google Maps
                </Button>
              </div>
              <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] relative">
                <LeafletMap
                  center={[place.latitude || 10, place.longitude || 76]}
                  zoom={13}
                  markers={[{ lat: place.latitude, lng: place.longitude, title: place.name }]}
                  height="600px"
                />
              </div>
            </section>

            {/* Community Photos Section */}
            <PlacePhotoGallery placeId={place._id} placeName={place.name} />

            {/* Reviews Section */}
            <section id="reviews" className="space-y-12">
              <div className="flex items-baseline justify-between">
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Guest Stories</h2>
                <div className="text-xl font-bold text-primary">
                  {totalReviews} Experiences
                </div>
              </div>

              <ReviewSummary
                ratingAvg={place.ratingAvg}
                ratingCount={totalReviews}
                breakdown={reviewBreakdown}
              />

              {user ? (
                <ReviewForm
                  targetId={placeId}
                  targetType="place"
                  onReviewAdded={handleReviewChanged}
                />
              ) : (
                <div className="bg-muted/50 p-12 rounded-[2rem] border-2 border-dashed border-muted-foreground/10 text-center mb-12">
                  <p className="text-xl text-muted-foreground mb-8">Have you visited {place.name}? Share your thoughts with the community.</p>
                  <Link href="/login">
                    <Button className="bg-primary text-primary-foreground px-12 h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">Sign in to Review</Button>
                  </Link>
                </div>
              )}

              <ReviewList
                reviews={reviews}
                totalReviews={totalReviews}
                hasMore={hasMoreReviews}
                onLoadMore={() => fetchReviews(reviewPage + 1)}
                onReviewDeleted={(id) => {
                  setReviews(prev => prev.filter(r => r._id !== id));
                  setTotalReviews(prev => prev - 1);
                  fetchBreakdown();
                }}
                onReviewUpdated={handleReviewChanged}
                isLoadingMore={isFetchingReviews}
              />
            </section>
          </div>

        </div>

        {/* RIGHT: Sidebar */}
        <div className="lg:col-span-4 space-y-12">

          <QuickInfoPanel place={place} />

          {/* Action Card */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] sticky top-32 overflow-hidden border border-white/10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

            <div className="relative z-10 space-y-2">
              <h3 className="text-3xl font-black tracking-tight">Plan Your Journey</h3>
              <p className="text-white/60 font-medium leading-relaxed">Let us help you create an unforgettable experience at {place.name}.</p>
            </div>

            <div className="relative z-10 space-y-4">
              <Button onClick={handleAddToItinerary} className="w-full h-20 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--primary),0.4)]">
                {addedToItinerary ? "Saved to Plan" : "Add to Itinerary"}
              </Button>
              <Button variant="outline" className="w-full h-20 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xl transition-all">
                Book Private Tour
              </Button>
            </div>

            <div className="relative z-10 pt-4 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Secure Booking & Expert Guides</p>
            </div>
          </div>

          {/* Nearby Places Sidebar (Desktop) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Explore Beyond</h3>
            </div>
            <div className="grid gap-6">
              {nearbyPlaces.length > 0 ? nearbyPlaces.map(np => (
                <Link key={np._id} href={`/places/${np._id}`} className="group block">
                  <div className="bg-white hover:bg-white rounded-3xl p-5 transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-transparent hover:border-gray-100 flex gap-6">
                    <div className="h-24 w-24 rounded-[1.5rem] overflow-hidden shrink-0 shadow-lg relative">
                      <img src={np.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={np.name} />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="flex flex-col justify-center gap-1.5">
                      <h4 className="font-black text-gray-900 group-hover:text-primary transition-colors text-lg line-clamp-1">{np.name}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-black">{np.ratingAvg}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{np.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-muted-foreground text-sm italic px-2">No other places nearby found.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Similar Places (Mobile Bottom) */}
      <div className="lg:hidden mt-12">
        <h3 className="font-bold text-xl text-gray-900 mb-4">You might also like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nearbyPlaces.map(np => (
            <PlaceCard key={np._id} place={np} />
          ))}
        </div>
      </div>
    </main>
  )
}
