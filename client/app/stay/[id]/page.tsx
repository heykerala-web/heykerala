"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { stayService, Stay, BookingData } from "@/services/stayService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function StayDetailsPage({ params }: { params: { id: string } }) {
    // const { id } = useParams();
    const id = params.id;
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();

    const [stay, setStay] = useState<Stay | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Booking State
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        const fetchStay = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setStay(null);

                const response = await stayService.getById(id as string);

                if (response && response.success) {
                    setStay(response.data);
                } else {
                    console.error("Stay fetch failed:", response);
                    setStay(null);
                }
            } catch (err) {
                console.error("Failed to fetch stay:", err);
                setStay(null);
                toast({ title: "Error loading stay details", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchStay();
    }, [id]);

    const handleBooking = async () => {
        if (!stay) return;
        if (!checkIn || (isStayType() && !checkOut)) {
            toast({ title: "Please select dates", variant: "destructive" });
            return;
        }

        if (!user) {
            toast({ title: "Please login to book", variant: "destructive" });
            router.push("/login?redirect=/stay/" + id);
            return;
        }

        setBookingLoading(true);
        try {
            const data: BookingData = {
                stayId: stay._id,
                userId: user.id || (user as any)._id,
                checkIn,
                checkOut: isStayType() ? checkOut : checkIn,
                guests: { adults: guests, children: 0 },
            };

            await stayService.createBooking(data);
            toast({ title: "Booking Request Sent!", description: "We will confirm your booking shortly." });
            setCheckIn("");
            setCheckOut("");
        } catch (error: any) {
            toast({ title: "Booking Failed", description: error.response?.data?.message || "Please try again", variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    };

    const isStayType = () => {
        return stay?.type === 'hotel' || stay?.type === 'resort' || stay?.type === 'homestay';
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!stay) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Stay Not Found</h1>
                <p className="text-gray-500 mb-8 max-w-md">We couldn't find the stay you're looking for. It might have been removed or the link is incorrect.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => window.location.reload()} variant="outline" className="min-w-[140px]">
                        Retry
                    </Button>
                    <Link href="/stay">
                        <Button className="min-w-[140px]">Browse All Stays</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={stay.images[0] || "/placeholder.svg"}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="container mx-auto px-4 py-8 text-white">
                        <Link href="/stay" className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
                            <ArrowLeft className="h-4 w-4" /> Back to Stays
                        </Link>
                        <Badge className="bg-primary hover:bg-primary mb-2 capitalize">{stay.type}</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">{stay.name}</h1>
                        <div className="flex items-center gap-4 text-lg">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-5 w-5 text-gray-300" /> {stay.district}
                            </span>
                            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded backdrop-blur-sm">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {stay.ratingAvg}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">About</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{stay.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">Amenities</h2>
                        <div className="flex flex-wrap gap-3">
                            {stay.amenities.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 border px-4 py-3 rounded-lg text-gray-700 font-medium">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    {item}
                                </div>
                            ))}
                            {stay.amenities.length === 0 && <p className="text-gray-500">No specific amenities listed.</p>}
                        </div>
                    </section>

                    {/* Gallery (rest of images) */}
                    {stay.images.length > 1 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">Gallery</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {stay.images.slice(1).map((img, i) => (
                                    <img key={i} src={img} alt={`Gallery ${i}`} className="rounded-xl h-64 w-full object-cover hover:opacity-95 transition" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border rounded-2xl shadow-xl p-8 sticky top-24">
                        <div className="mb-6 border-b pb-6">
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-bold text-gray-900">₹{stay.price}</span>
                                <span className="text-gray-500 text-lg mb-1">
                                    {isStayType() ? '/ night' : '/ person approx.'}
                                </span>
                            </div>
                            <p className="text-green-600 text-sm mt-1 font-medium">Best price guarantee</p>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>{isStayType() ? "Check-In" : "Date"}</Label>
                                    <Input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                {isStayType() && (
                                    <div className="space-y-1.5">
                                        <Label>Check-Out</Label>
                                        <Input
                                            type="date"
                                            value={checkOut}
                                            min={checkIn}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="h-11"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Guests</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="h-11"
                                />
                            </div>

                            <Button
                                className="w-full text-lg py-6 mt-4 shadow-lg hover:shadow-xl transition-all"
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                {isStayType() ? "Reserve Stay" : "Book Table"}
                            </Button>

                            <p className="text-center text-xs text-gray-400 mt-2">
                                You won't be charged yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
