"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { stayService, Stay, BookingData } from "@/services/stayService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Star, CheckCircle, ArrowLeft, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReviewSection from "@/components/reviews/ReviewSection";
import { ReviewSummary as AIReviewSummary } from "@/components/ai/ReviewSummary";
import { reviewService } from "@/services/reviewService";
import { Review } from "@/types/review";

// Premium Components
import PlaceGallery from "@/app/components/places/PlaceGallery";
import StickyMiniHeader from "@/app/components/places/StickyMiniHeader";
import QuickInfoPanel from "@/app/components/places/QuickInfoPanel";

import { getFullImageUrl } from "@/lib/images";
import { queueBooking } from "@/lib/offline-db";
import PayPalButtons from "@/app/components/payment/PayPalButtons";

export default function StayDetailsClient({ id, initialStay }: { id: string, initialStay?: Stay | null }) {
    const router = useRouter();
    const { toast } = useToast();

    const [stay, setStay] = useState<Stay | null>(initialStay || null);
    const [loading, setLoading] = useState(!initialStay);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Booking State
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [bookingTime, setBookingTime] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'manual_upi' | 'paypal'>('paypal');
    const [showManualPaymentDialog, setShowManualPaymentDialog] = useState(false);
    const [tempBookingId, setTempBookingId] = useState("");
    const [tempBookingAmount, setTempBookingAmount] = useState(0);
    const [transactionId, setTransactionId] = useState("");
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const [isDemoProcessing, setIsDemoProcessing] = useState(false);

    const { user, updateUser } = useAuth();

    // Load Payment Scripts
    useEffect(() => {
        // Razorpay
        const rzpScript = document.createElement("script");
        rzpScript.src = "https://checkout.razorpay.com/v1/checkout.js";
        rzpScript.async = true;
        rzpScript.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(rzpScript);

        // PayPal
        const ppClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
        const ppScript = document.createElement("script");
        ppScript.src = `https://www.paypal.com/sdk/js?client-id=${ppClientId}&currency=INR&intent=capture`;
        ppScript.async = true;
        ppScript.onload = () => setPaypalLoaded(true);
        document.body.appendChild(ppScript);

        return () => {
            document.body.removeChild(rzpScript);
            if (document.body.contains(ppScript)) {
                document.body.removeChild(ppScript);
            }
        }
    }, []);

    // Check if favorite
    useEffect(() => {
        if (user && id) {
            const savedStays = (user as any).savedStays || [];
            setIsFavorite(savedStays.some((s: any) => (typeof s === 'string' ? s : s._id) === id));
        }

        const handleOnline = async () => {
            const { getQueuedBookings, clearQueuedBooking } = await import("@/lib/offline-db");
            const queued = await getQueuedBookings();
            if (queued.length > 0) {
                toast({ title: "Back online!", description: "Processing your queued bookings..." });
                for (const booking of queued) {
                    try {
                        if (booking.type === 'stay') {
                            await stayService.createBooking(booking.data);
                        } else {
                            await stayService.createRestaurantBooking(booking.data);
                        }
                        await clearQueuedBooking(booking.id!);
                    } catch (e) {
                        console.error("Sync failed for booking", booking.id, e);
                    }
                }
                toast({ title: "Sync Complete", description: "Offline bookings have been processed." });
            }
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [user, id]);

    const handleToggleSave = async () => {
        if (!user) {
            toast({ title: "Please login to save stays", variant: "destructive" });
            router.push("/login?redirect=/stay/" + id);
            return;
        }

        try {
            if (isFavorite) {
                await api.delete(`/users/save/stay/${id}`);
                toast({ title: "Removed from saved stays" });
                const currentSaved = (user as any).savedStays || [];
                const newSaved = currentSaved.filter((s: any) => (typeof s === 'string' ? s : s._id) !== id);
                updateUser({ savedStays: newSaved });
            } else {
                await api.post(`/users/save/stay/${id}`);
                toast({ title: "Added to saved stays" });
                const currentSaved = (user as any).savedStays || [];
                const newSaved = [...currentSaved, id];
                updateUser({ savedStays: newSaved });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast({ title: "Failed to update saved stays", variant: "destructive" });
        }
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link copied to clipboard!" });
        }
    };

    const handleReviewChanged = (updatedReview: any) => {
        if (updatedReview.ratingInfo) {
            setStay(prev => prev ? {
                ...prev,
                ratingAvg: updatedReview.ratingInfo.ratingAvg,
                ratingCount: updatedReview.ratingInfo.ratingCount
            } : null);
        }
    };

    useEffect(() => {
        const fetchStay = async () => {
            if (initialStay) {
                return;
            }
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
    }, [id, initialStay]);

    const initiatePayment = async (booking: any) => {
        if (paymentMethod === 'manual_upi') {
            setTempBookingId(booking._id);
            setTempBookingAmount(booking.totalPrice || stay?.price || 0);
            setShowManualPaymentDialog(true);
            return;
        }

        if (paymentMethod === 'paypal') {
            // PayPal Buttons will be rendered by the SDK in the UI
            // We'll set the tempBookingId and handle the callback
            setTempBookingId(booking._id);
            setTempBookingAmount(booking.totalPrice || stay?.price || 0);
            return;
        }

        try {
            const amount = booking.totalPrice || 500; // Default or calculated
            const orderRes = await stayService.createPaymentOrder(amount, booking._id);

            if (!orderRes.success) {
                toast({ title: "Payment Error", description: "Failed to create order.", variant: "destructive" });
                return;
            }

            // Check for placeholder key - Use Demo Mode
            if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === "rzp_test_placeholder" || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                toast({ title: "Demo Mode Active", description: "Simulating secure payment process..." });

                // Simulate processing time
                setTimeout(async () => {
                    try {
                        const verifyRes = await api.post("/payment/demo-verify", { order_id: orderRes.order.id });
                        if (verifyRes.data.success) {
                            toast({ title: "Booking Confirmed!", description: "Demo payment successful." });
                            router.push(`/dashboard/bookings?id=${booking._id}`);
                        } else {
                            toast({ title: "Demo Payment Failed", variant: "destructive" });
                            setBookingLoading(false);
                        }
                    } catch (err) {
                        console.error("Demo verification error:", err);
                        toast({ title: "Error in Demo Flow", variant: "destructive" });
                        setBookingLoading(false);
                    }
                }, 2500);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderRes.order.amount,
                currency: "INR",
                name: "Hey Kerala",
                description: `Booking for ${stay?.name}`,
                order_id: orderRes.order.id,
                handler: async (response: any) => {
                    const verifyRes = await stayService.verifyPayment(response);
                    if (verifyRes.success) {
                        toast({ title: "Booking Confirmed!", description: "Payment successful and booking confirmed." });
                        router.push(`/dashboard/bookings?id=${booking._id}`);
                    } else {
                        toast({ title: "Payment Failed", description: "Verification failed. Please contact support.", variant: "destructive" });
                    }
                },
                prefill: {
                    name: user?.name,
                    email: (user as any)?.email,
                    contact: (user as any)?.phone || "",
                },
                theme: {
                    color: "#00c8ff",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast({ title: "Payment Error", description: "Failed to initiate payment. Please try again.", variant: "destructive" });
        }
    };

    const handleManualPaymentSubmit = async () => {
        if (!transactionId) {
            toast({ title: "Transaction ID Required", variant: "destructive" });
            return;
        }

        setBookingLoading(true);
        try {
            const res = await stayService.submitManualPayment(tempBookingId, transactionId);
            if (res.success) {
                toast({ title: "Submit Successful", description: "Payment details submitted for verification." });
                setShowManualPaymentDialog(false);
                router.push(`/dashboard/bookings?id=${tempBookingId}`);
            }
        } catch (error: any) {
            toast({ title: "Submission Failed", description: "Failed to submit payment details.", variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!stay) {
            return;
        }

        if (isStayType()) {
            if (!checkIn || !checkOut) {
                toast({ title: "Please select dates", variant: "destructive" });
                return;
            }
            if (stay.roomTypes && stay.roomTypes.length > 0 && !selectedRoom) {
                toast({ title: "Please select a room type", variant: "destructive" });
                return;
            }
            const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
            const minStay = stay.minStay || 1;
            if (nights < minStay) {
                toast({ title: `Minimum stay is ${minStay} night(s).`, variant: "destructive" });
                return;
            }
        } else {
            if (!checkIn || !bookingTime) {
                toast({ title: "Please select date and time", variant: "destructive" });
                return;
            }
        }

        if (!user) {
            toast({ title: "Please login to book", variant: "destructive" });
            router.push("/login?redirect=/stay/" + id);
            return;
        }

        setBookingLoading(true);
        try {
            if (!navigator.onLine) {
                if (isStayType()) {
                    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
                    const pricePerNight = selectedRoom?.basePrice || stay.price;
                    const totalPrice = nights * pricePerNight;
                    const data: any = {
                        stayId: stay._id,
                        checkIn,
                        checkOut,
                        roomType: selectedRoom?.name || "Standard",
                        guests: { adults: guests, children: 0 },
                        totalPrice
                    };
                    await queueBooking('stay', data);
                } else {
                    const data: any = {
                        restaurantId: stay._id,
                        bookingDate: checkIn,
                        bookingTime,
                        numberOfGuests: guests,
                    };
                    await queueBooking('restaurant', data);
                }
                toast({ title: "Offline Mode", description: "Booking queued and will be processed when you are back online." });
                setCheckIn("");
                setCheckOut("");
                setBookingLoading(false);
                return;
            }

            if (isStayType()) {
                const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
                const pricePerNight = selectedRoom?.basePrice || stay.price;
                const totalPrice = nights * pricePerNight;

                const data: any = {
                    stayId: stay._id,
                    checkIn,
                    checkOut,
                    roomType: selectedRoom?.name || "Standard",
                    guests: { adults: guests, children: 0 },
                    totalPrice: totalPrice || 0
                };

                const apiRes = await stayService.createBooking(data);

                // Safety check for response structure
                const booking = apiRes.booking || apiRes.data?.booking;
                if (!booking) {
                    throw new Error("Booking object missing from response");
                }

                if (paymentMethod === 'paypal') {
                    setIsDemoProcessing(true);
                    // Simulate PayPal Sandbox Processing
                    setTimeout(async () => {
                        try {
                            const verifyRes = await api.post("/payments/paypal/demo-verify", { bookingId: booking._id });
                            if (verifyRes.data.success) {
                                toast({ title: "Payment Successful", description: "PayPal Sandbox demo payment verified." });
                                router.push(`/booking/confirmation/${booking._id}`);
                            } else {
                                toast({ title: "Payment Failed", variant: "destructive" });
                                setIsDemoProcessing(false);
                            }
                        } catch (err) {
                            toast({ title: "Error in Payment Flow", variant: "destructive" });
                            setIsDemoProcessing(false);
                        }
                    }, 3000);
                    return;
                }

                toast({ title: "Booking Initiated", description: "Redirecting to payment..." });
                await initiatePayment(booking);
            } else {
                const data: any = {
                    restaurantId: stay._id,
                    bookingDate: checkIn,
                    bookingTime,
                    numberOfGuests: guests,
                };
                await stayService.createRestaurantBooking(data);
                toast({ title: "Request Sent!", description: "Your table reservation request is being processed." });
            }

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
        <div className="min-h-screen bg-white">
            <StickyMiniHeader
                place={{
                    name: stay.name,
                    ratingAvg: stay.ratingAvg,
                    _id: stay._id
                }}
                isFavorite={isFavorite}
                onToggleSave={handleToggleSave}
                onShare={handleShare}
            />

            {/* CINEMATIC HERO */}
            <div className="relative h-[90vh] w-full overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={getFullImageUrl(stay.images[0], stay.name, stay.type, undefined, (stay as any).updatedAt)}
                        alt={stay.name}
                        className="w-full h-full object-cover scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
                </div>

                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
                    <Link href="/stay">
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
                                <span className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-[0.3em]">
                                    {stay.type}
                                </span>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 text-sm font-black text-white">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    {stay.ratingAvg} <span className="text-white/40 ml-1 font-medium">({stay.ratingCount || 0} Reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl">
                                {stay.name}
                            </h1>

                            <div className="flex items-center gap-3 text-white/80 text-xl font-medium">
                                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-md">
                                    <MapPin className="h-6 w-6 text-accent" />
                                </div>
                                <span className="tracking-tight">{stay.district}, Kerala</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-24">

                        {/* Gallery Grid */}
                        <section className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Property Gallery</h2>
                                <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">Exquisite captures from around the property</p>
                            </div>
                            <PlaceGallery images={stay.images.map(img => getFullImageUrl(img, stay.name, stay.type, undefined, (stay as any).updatedAt))} name={stay.name} />
                        </section>

                        {/* About Section */}
                        <section className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-8">
                                <h2 className="text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter">
                                    Escape to <br /><span className="text-primary">{stay.name}</span>
                                </h2>
                                <div className="w-24 h-2 bg-primary/20 rounded-full" />
                                <div className="text-xl text-gray-600 leading-relaxed font-medium space-y-6">
                                    {stay.description}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                                <h3 className="text-2xl font-black text-gray-900">Premium Amenities</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {stay.amenities.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-bold text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                    {stay.amenities.length === 0 && <p className="text-gray-500 italic">Essential property amenities included.</p>}
                                </div>
                                <div className="pt-8 border-t border-gray-200">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Location & Accessibility</p>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                                        <p className="text-gray-500 font-medium leading-relaxed">{stay.district}, Kerala</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section */}
                        <section id="reviews" className="space-y-12">
                            <ReviewSection
                                targetId={id}
                                targetType="stay"
                                initialRatingAvg={stay.ratingAvg}
                                initialRatingCount={stay.ratingCount}
                            />
                        </section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <QuickInfoPanel place={{
                            category: stay.type,
                            bestTimeToVisit: "All Year Round",
                            entryFee: stay.price,
                            openingHours: "24/7 Check-in"
                        }} />

                        <div className="bg-gray-900 border-white/10 rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] p-10 sticky top-32 text-white group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

                            <div className="relative z-10 mb-8 border-b border-white/10 pb-8">
                                <div className="flex items-end gap-1">
                                    <span className="text-5xl font-black text-white">₹{stay.price}</span>
                                    <span className="text-white/40 text-lg mb-1 font-bold">
                                        {isStayType() ? '/ night' : '/ guest'}
                                    </span>
                                </div>
                                <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mt-2">Premium Member Rate</p>
                            </div>

                            <div className="space-y-6">
                                {isStayType() && stay.roomTypes && stay.roomTypes.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Room Category</Label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {stay.roomTypes.map((room, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedRoom(room)}
                                                    className={`p-4 rounded-xl border text-left transition-all ${selectedRoom?.name === room.name ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold">{room.name}</span>
                                                        <span className="text-xs font-black">₹{room.basePrice}</span>
                                                    </div>
                                                    <p className="text-[10px] opacity-60 mt-1 line-clamp-1">{room.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isStayType() && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Booking Time</Label>
                                        <Input
                                            type="time"
                                            value={bookingTime}
                                            step="1800" // 30 min increments
                                            onChange={(e) => setBookingTime(e.target.value)}
                                            className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus:bg-white/10 transition-all font-bold"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{isStayType() ? "Check-In" : "Date"}</Label>
                                        <Input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus:bg-white/10 transition-all font-bold"
                                        />
                                    </div>
                                    {isStayType() && (
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Check-Out</Label>
                                            <Input
                                                type="date"
                                                value={checkOut}
                                                min={checkIn}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus:bg-white/10 transition-all font-bold"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{isStayType() ? "Guests" : "Table For"}</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus:bg-white/10 transition-all font-bold"
                                    />
                                </div>

                                {/* Payment Method Selection - Simplified to PayPal Only */}
                                <div className="space-y-4 pt-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Payment Method</Label>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div
                                            className="p-4 rounded-xl border flex flex-col items-center gap-2 transition-all relative bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                        >
                                            <span className="text-xs font-black uppercase tracking-tighter">PayPal (Pro Secure)</span>
                                            <div className="h-1 w-12 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'paypal' && tempBookingId && (
                                    <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div id="paypal-button-container" className="w-full">
                                            {paypalLoaded && (
                                                <PayPalButtons
                                                    bookingId={tempBookingId}
                                                    amount={tempBookingAmount}
                                                    onSuccess={(res: any) => {
                                                        toast({ title: "Booking Confirmed!", description: "PayPal payment successful." });
                                                        router.push(`/booking/confirmation/${tempBookingId}`);
                                                    }}
                                                    onError={(err: any) => {
                                                        toast({ title: "Payment Failed", description: "PayPal transaction could not be completed.", variant: "destructive" });
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    className="w-full h-20 text-xl font-black rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:scale-[1.02] transition-all"
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? <Loader2 className="animate-spin mr-3" /> : null}
                                    {isStayType() ? "Reserve Now" : "Request Booking"}
                                </Button>

                                <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mt-2">
                                    {isStayType() ? "Secure Payment & Flexible Cancellation" : "No pre-payment required for table booking"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Payment Dialog */}
            {showManualPaymentDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-black text-white">Manual UPI Payment</h2>
                            <p className="text-white/60">Please pay ₹{tempBookingAmount} to the VR Code or VPA below and enter the Transaction ID.</p>
                        </div>

                        <div className="flex flex-col items-center gap-6 py-4">
                            {/* Dummy QR Code Image */}
                            <div className="w-48 h-48 bg-white p-4 rounded-3xl overflow-hidden">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=heykerala@upi&pn=HeyKerala&am=${tempBookingAmount}&cu=INR`}
                                    alt="UPI QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-primary font-bold text-lg select-all">heykerala@upi</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">UTR / Transaction ID</Label>
                            <Input
                                type="text"
                                placeholder="Enter 12-digit Transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 rounded-xl text-white focus:bg-white/10 transition-all font-bold placeholder:text-white/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Button
                                variant="outline"
                                className="h-16 rounded-2xl border-white/10 text-white hover:bg-white/5"
                                onClick={() => setShowManualPaymentDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="h-16 rounded-2xl bg-primary text-primary-foreground font-black"
                                onClick={handleManualPaymentSubmit}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* PayPal Demo Processing Overlay */}
            {isDemoProcessing && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-3xl p-12 max-w-sm w-full shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="relative mx-auto w-24 h-24">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="w-12 h-auto" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900">PayPal Sandbox</h3>
                            <p className="text-gray-500 font-medium">Processing PayPal Sandbox Payment...</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Demo Mode Active</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
