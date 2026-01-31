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
import { Review } from "@/types/review"

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // const { id } = useParams() as { id?: string | string[] }
  const placeId = params.id;

  const [place, setPlace] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
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

        const placeData = await placeService.getById(placeId);

        if (placeData && placeData.success) {
          setPlace(placeData.data);

          // Fetch Reviews
          try {
            const reviewData = await reviewService.getReviewsByPlace(placeId);
            if (reviewData.success) setReviews(reviewData.data);
          } catch (e) { console.error("Reviews fetch failed", e); }

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
        await api.delete(`/users/save/${placeId}`);
        toast.success("Removed from saved places");
        const newSaved = user.savedPlaces?.filter((p: any) => {
          const savedId = typeof p === 'string' ? p : p._id;
          return savedId !== placeId;
        });
        updateUser({ savedPlaces: newSaved });
      } else {
        await api.post(`/users/save/${placeId}`);
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

  const handleReviewAdded = (newReviewData: any) => {
    // Ideally we re-fetch to get populated fields but for now we can just push if we have user info
    // Or just re-fetch reviews
    reviewService.getReviewsByPlace(placeId).then((res) => {
      if (res.success) setReviews(res.data);
    });

    // Also update place rating visually
    setPlace((prev: any) => ({
      ...prev,
      ratingAvg: newReviewData.placeRating || prev.ratingAvg, // Backend could return new average. For now, let's rely on refresh or just optimistic placeholder if we knew the math
    }));
    // Actually the create endpoint should probably return the new place average rating to make this seamless
    // I updated backend to return `placeRating`
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
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800">Place Not Found</h1>
        <p className="text-gray-500 mt-2 mb-6">We couldn't find the place you're looking for.</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
          <Link href="/explore">
            <Button className="bg-emerald-600">Back to Explore</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = place.images?.length > 0 ? place.images : [place.image || "/placeholder.svg"];

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">

      {/* HERO SECTION */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-gray-900 group">
        {images.map((img: string, idx: number) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img}
              alt={place.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}

        {/* Navigation */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
            className="pointer-events-auto p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
            className="pointer-events-auto p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Top Navbar Placeholder (BackButton) */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
          <Link href="/explore">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all cursor-pointer">
              <ChevronLeft className="h-6 w-6" />
            </div>
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleToggleSave}
              className={`p-3 backdrop-blur-md rounded-full transition-all ${isFavorite ? "bg-white text-red-500" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Bottom Title Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold border border-white/10">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    {place.ratingAvg || place.rating || 0} ({place.totalReviews || reviews.length} reviews)
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight tracking-tight shadow-sm">
                  {place.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-200">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  <span className="text-lg">{place.district}, Kerala</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToItinerary} className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/20 text-lg">
                  {addedToItinerary ? "Added to Plan" : "Add to Itinerary"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS CONTENT */}
      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-8 text-gray-800">
            {/* About */}
            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 font-poppins">About {place.name}</h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                  {place.description}
                </div>

                {/* Highlights Tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {place.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" /> Location
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{place.location}</p>
                </div>
                <div className="h-[400px] w-full bg-gray-100">
                  <LeafletMap
                    center={[place.latitude || 10, place.longitude || 76]}
                    zoom={13}
                    markers={[{ lat: place.latitude, lng: place.longitude, title: place.name }]}
                    height="400px"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <div id="reviews" className="pt-4">
              <h2 className="text-2xl font-bold mb-6 px-2 flex items-center justify-between">
                <span>Reviews <span className="text-gray-400 text-lg font-normal">({reviews.length})</span></span>
              </h2>

              {user ? (
                <ReviewForm placeId={placeId} onReviewAdded={handleReviewAdded} />
              ) : (
                <div className="bg-emerald-50 p-6 rounded-2xl mb-8 border border-emerald-100 text-center">
                  <p className="text-emerald-800 mb-3">Login to share your experience!</p>
                  <Link href="/login">
                    <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">Log In to Review</Button>
                  </Link>
                </div>
              )}

              <ReviewList reviews={reviews} />
            </div>

          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            {weather && (
              <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Current Weather</p>
                      <h3 className="text-4xl font-bold">{weather.temperature}°C</h3>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Wind className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4 text-sm font-medium text-blue-100">
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" /> {weather.windspeed} km/h
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="opacity-70">Direction:</span> {weather.winddirection}°
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card className="rounded-3xl shadow-lg border-0 bg-white">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Plan your visit</h3>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Best Time</p>
                    <p className="font-semibold text-gray-800">{place.bestTimeToVisit || "Sep - Mar"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 shrink-0">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Ideal Duration</p>
                    <p className="font-semibold text-gray-800">2 - 3 Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places Sidebar (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="font-bold text-lg text-gray-900 mb-4 px-2">More in {place.district}</h3>
              <div className="space-y-4">
                {nearbyPlaces.length > 0 ? nearbyPlaces.map(np => (
                  <Link key={np._id} href={`/places/${np._id}`} className="block group">
                    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-all">
                      <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0">
                        <img src={np.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform" alt={np.name} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700">{np.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {np.ratingAvg}
                        </div>
                        <span className="text-xs text-emerald-600 mt-1 inline-block bg-emerald-50 px-2 py-0.5 rounded">{np.category}</span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-gray-500 text-sm italic px-2">No other places nearby found.</p>
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

      </div>
    </main>
  )
}
