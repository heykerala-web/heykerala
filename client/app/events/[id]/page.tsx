"use client";
import { useEffect, useState } from "react";

import { eventService, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, Clock, Share2, Heart, ArrowLeft, Info, Phone, Mail, Youtube, Instagram, Facebook, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import ReviewSection from "@/components/reviews/ReviewSection";
import { ReviewSummary as AIReviewSummary } from "@/components/ai/ReviewSummary";
import { reviewService } from "@/services/reviewService";
import { Review } from "@/types/review";
import { NotifyMeButton } from "@/components/events/NotifyMeButton";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";

// Premium Components
import PlaceGallery from "@/app/components/places/PlaceGallery";
import StickyMiniHeader from "@/app/components/places/StickyMiniHeader";
import QuickInfoPanel from "@/app/components/places/QuickInfoPanel";
import { format } from "date-fns";
import { getFullImageUrl } from "@/lib/images";
import PlacePhotoGallery from "@/components/places/PlacePhotoGallery";

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // const { id } = useParams();
  const id = params.id;
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);

  // Check if favorite
  useEffect(() => {
    if (user && id) {
      const savedEvents = (user as any).savedEvents || [];
      setIsFavorite(savedEvents.some((e: any) => (typeof e === 'string' ? e : e._id) === id));
    }
  }, [user, id]);

  const fetchUserPhotos = async () => {
    try {
      const res = await api.get(`/place-photos/${id}?type=event`);
      if (res.data.success) {
        setUserPhotos(res.data.data);
      }
    } catch (e) {
      console.error("User photos fetch failed", e);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({ title: "Please login to save events", variant: "destructive" });
      router.push("/login?redirect=/events/" + id);
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/users/save/event/${id}`);
        toast({ title: "Removed from saved events" });
        const currentSaved = (user as any).savedEvents || [];
        const newSaved = currentSaved.filter((e: any) => (typeof e === 'string' ? e : e._id) !== id);
        updateUser({ savedEvents: newSaved });
      } else {
        await api.post(`/users/save/event/${id}`);
        toast({ title: "Added to saved events" });
        const currentSaved = (user as any).savedEvents || [];
        const newSaved = [...currentSaved, id];
        updateUser({ savedEvents: newSaved });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast({ title: "Failed to update saved events", variant: "destructive" });
    }
  };

  const handleReviewChanged = (updatedReview: any) => {
    if (updatedReview.ratingInfo) {
      setEvent(prev => prev ? {
        ...prev,
        ratingAvg: updatedReview.ratingInfo.ratingAvg,
        ratingCount: updatedReview.ratingInfo.ratingCount
      } : null);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setEvent(null);

        // Fetch User Photos
        fetchUserPhotos();

        const response = await eventService.getById(id as string);

        if (response && response.success) {
          setEvent(response.data);
        } else {
          console.error("Event fetch failed:", response);
          setEvent(null);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setEvent(null);
        toast({ title: "Error loading event", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-gray-500 font-medium">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600">
          <Calendar className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">This event may have been cancelled, removed, or the link is expired.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => window.location.reload()} variant="outline" className="min-w-[140px]">
            Retry
          </Button>
          <Link href="/events">
            <Button className="bg-emerald-600 min-w-[140px]">Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyMiniHeader
        place={{
          name: event.title,
          ratingAvg: event.ratingAvg || 0,
          _id: event._id
        }}
        isFavorite={isFavorite}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
      />

      {/* 🔹 CINEMATIC HERO */}
      <div className="relative h-[90vh] w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={getFullImageUrl(event.images?.[0], event.title, event.category)}
            alt={event.title}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
          <Link href="/events">
            <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full h-14 w-14 p-0 backdrop-blur-md border border-white/10">
              <ArrowLeft className="h-8 w-8" />
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
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-[0.3em]">
                  {event.category}
                </span>
                {(event as any).eventStatus && (
                  <EventStatusBadge status={(event as any).eventStatus} size="md" />
                )}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 text-sm font-black text-white">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  {event.ratingAvg || 0} <span className="text-white/40 ml-1 font-medium">({event.ratingCount || 0} Reviews)</span>
                </div>
              </div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-white/90 font-bold">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Calendar className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Date</span>
                    <span className="text-lg tracking-tight">
                      {format(new Date(event.startDate), "EEEE, MMMM do, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Clock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Time</span>
                    <span className="text-lg tracking-tight">{event.time || "TBA"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <MapPin className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Venue</span>
                    <span className="text-lg tracking-tight">{event.venue}, {event.district}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          {/* 🔹 Main Content (Left) */}
          <div className="lg:col-span-8 space-y-24">
            {/* Gallery Grid */}
            <section className="space-y-8">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Event Moments</h2>
                <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">Visual highlights from this cultural experience</p>
              </div>
              <PlaceGallery
                images={[...(event.images || []), ...(userPhotos.map(p => p.image))].map(img => getFullImageUrl(img, event.title, event.category))}
                name={event.title}
              />
            </section>

            {/* Description Section */}
            <section className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <h2 className="text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                  Discover the <br /><span className="text-emerald-600">Essence</span>
                </h2>
                <div className="w-24 h-2 bg-emerald-100 rounded-full" />
                <div className="text-xl text-gray-600 leading-relaxed font-medium space-y-6">
                  {event.description}
                </div>
              </div>

              <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100/50 space-y-8">
                <h3 className="text-2xl font-black text-gray-900">Event Essentials</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
                      <Info className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Category</p>
                      <p className="font-bold text-gray-700">{event.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Venue</p>
                      <p className="font-bold text-gray-700">{event.venue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Traveler Photos Section */}
            <PlacePhotoGallery
              targetId={event._id}
              targetName={event.title}
              targetType="event"
              externalPhotos={userPhotos}
              onUpdate={fetchUserPhotos}
            />

            {/* Map Section */}
            <section className="space-y-8">
              <div className="flex items-baseline justify-between">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Navigation</h2>
                <Button variant="link" className="text-emerald-600 font-bold p-0 h-auto">Open in Google Maps</Button>
              </div>
              <div className="bg-gray-100 h-[400px] rounded-[3rem] overflow-hidden border border-gray-200 group relative">
                <div className="absolute inset-0 bg-emerald-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-xl shadow-emerald-200/50">
                      <MapPin className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{event.venue}</h3>
                    <p className="text-gray-500 font-medium mb-6">{event.district}, Kerala</p>
                    <Button className="rounded-2xl px-8 h-12 font-bold bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="space-y-12">
              <ReviewSection
                targetId={id}
                targetType="event"
                initialRatingAvg={event.ratingAvg}
                initialRatingCount={event.ratingCount}
              />
            </section>
          </div>

          {/* 🔹 Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-12">
            <QuickInfoPanel place={{
              category: event.category,
              bestTimeToVisit: format(new Date(event.startDate), "MMMM yyyy"),
              entryFee: "Standard Entry",
              openingHours: event.time || "TBA"
            }} />

            {/* Action Card */}
            <div className="bg-gray-900 border-white/10 rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] p-10 sticky top-32 text-white group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 mb-8 border-b border-white/10 pb-8 text-center">
                <span className="block text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Event Schedule</span>
                <p className="text-4xl font-black text-white mb-2">{format(new Date(event.startDate), "MMM do")}</p>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{event.time}</p>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                  <NotifyMeButton
                    eventId={event._id}
                    eventTitle={event.title}
                    initialHasReminder={(event as any).hasReminder || false}
                  />
                </div>
                <Button className="w-full h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all" onClick={() => toast({ title: "Added to calendar!" })}>
                  <Calendar className="h-6 w-6 mr-3" /> Add to Itinerary
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="ghost" className="h-16 border border-white/10 rounded-2xl hover:bg-white/5 font-bold" onClick={handleShare}>
                    <Share2 className="h-5 w-5 mr-2" /> Share
                  </Button>
                  <Button
                    onClick={handleToggleSave}
                    variant="ghost"
                    className={`h-16 border border-white/10 rounded-2xl hover:bg-white/5 font-bold ${isFavorite ? "text-rose-500" : ""}`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>

              <div className="relative z-10 mt-10 pt-8 border-t border-white/10">
                <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6">Organizer Support</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Phone className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Mail className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">support@heykerala.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
