"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventService, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, Clock, Share2, Heart, ArrowLeft, Info, Phone, Mail, Youtube, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // const { id } = useParams();
  const id = params.id;
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setEvent(null);
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
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 🔹 Hero Section (Banner) */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <img
          src={event.images[0] || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white">
                {event.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white">
                {event.district}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-4xl">{event.title}</h1>

            <div className="flex flex-col md:flex-row gap-6 md:items-center text-lg font-medium text-white/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>
                  {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <span>{event.time || "Time not specified"}</span>
              </div>
              <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>{event.venue}, {event.district}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 -mt-8 relative z-10">

        {/* 🔹 Main Content (Left) */}
        <div className="lg:col-span-2 space-y-10">

          {/* Description Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Info className="h-6 w-6 text-emerald-600" /> About the Event
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line max-w-none">
              {event.description}
            </div>
          </div>

          {/* Gallery Card */}
          {event.images.length > 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden h-64 group cursor-pointer relative">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Location</h2>
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                <MapPin className="h-4 w-4 mr-2" /> Get Directions
              </Button>
            </div>

            {/* Map Placeholder */}
            <div className="bg-emerald-50 h-80 rounded-2xl flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-emerald-100">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">{event.venue}</h3>
              <p className="text-gray-500 mb-2">{event.district}, Kerala</p>
              {event.latitude && <p className="text-xs text-gray-400 font-mono bg-white px-2 py-1 rounded border">Lat: {event.latitude}, Lng: {event.longitude}</p>}

              <p className="text-sm text-gray-400 mt-6 max-w-sm">Map view is simulated. In a real app, this would be an interactive Google Map or Leaflet map.</p>
            </div>
          </div>
        </div>

        {/* 🔹 Sidebar (Right) */}
        <div className="space-y-6">

          {/* Action Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <div className="text-center mb-6">
              <span className="block text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Date & Time</span>
              <p className="text-2xl font-bold text-gray-900">{new Date(event.startDate).toLocaleDateString()}</p>
              <p className="text-emerald-600 font-medium">{event.time}</p>
            </div>

            <div className="space-y-3">
              <Button className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={() => toast({ title: "Added to calendar!" })}>
                <Calendar className="h-5 w-5 mr-4" /> Add to Calendar
              </Button>
              <Button className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50" variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-4" /> Share Event
              </Button>
              <Button className="w-full h-12 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50" variant="ghost">
                <Heart className="h-5 w-5 mr-4" /> Save for later
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Contact Organizers</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 hover:text-emerald-600 cursor-pointer transition-colors">
                  <Phone className="h-4 w-4 mr-3" /> <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-600 hover:text-emerald-600 cursor-pointer transition-colors">
                  <Mail className="h-4 w-4 mr-3" /> <span>info@keralatourism.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Socials - Decorative */}
          <div className="flex justify-center gap-4 text-gray-400">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-rose-600 hover:scale-110 transition-all cursor-pointer"><Instagram className="h-5 w-5" /></div>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-blue-600 hover:scale-110 transition-all cursor-pointer"><Facebook className="h-5 w-5" /></div>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-red-600 hover:scale-110 transition-all cursor-pointer"><Youtube className="h-5 w-5" /></div>
          </div>

        </div>

      </div>
    </div>
  );
}
