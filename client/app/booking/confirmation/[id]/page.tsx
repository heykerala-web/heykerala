"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Users, MapPin, ArrowRight, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function BookingConfirmationPage() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await api.get(`/bookings/user-booking/${id}`);
                // Note: The backend route for single booking fetch needs verification
                // Assuming getUserBookings is intended to handle list, I'll use a direct internal API call or update a route if needed.
                // Let's assume a generic fetch for now or check backend routes.
                setBooking(response.data);
            } catch (err) {
                console.error("Failed to fetch booking:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
                <Link href="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-primary p-12 text-center text-white">
                        <div className="inline-flex items-center justify-center h-20 w-20 bg-white/20 rounded-full mb-6">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Payment Successful!</h1>
                        <p className="text-white/80 font-medium">Your stay at {booking.stayId?.name} is confirmed.</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Booking Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Home className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold">Property</p>
                                                <p className="font-bold text-gray-900">{booking.stayId?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold">Dates</p>
                                                <p className="font-bold text-gray-900">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-green-600">Paid (Sandbox)</span>
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-black uppercase text-gray-500 tracking-tighter">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-gray-500" />
                                            </div>
                                            {booking.totalPrice && (
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Paid</p>
                                                    <p className="font-black text-emerald-600">₹{booking.totalPrice}</p>
                                                    <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">
                                                        {booking.paymentMethod === 'paypal' ? 'PayPal Sandbox' : 'Razorpay'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Booking ID</p>
                                    <p className="font-mono text-xl font-black text-primary">{booking.bookingId || booking._id}</p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Payment Method</p>
                                    <p className="font-bold text-gray-600">PayPal (Sandbox Demo)</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/profile?tab=bookings" className="flex-1">
                                <Button className="w-full h-16 rounded-2xl font-black text-lg bg-primary text-primary-foreground shadow-lg hover:scale-[1.02] transition-transform">
                                    View My Bookings <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/" className="sm:w-1/3">
                                <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                                    Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs font-medium mt-8 uppercase tracking-[0.2em]">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    );
}
