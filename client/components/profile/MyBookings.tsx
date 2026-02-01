"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, Calendar, MapPin, Users, Ban } from "lucide-react";
import { format } from "date-fns";

export default function MyBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get("/users/bookings");
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const cancelBooking = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const { data } = await api.put(`/users/bookings/${id}/cancel`);
            if (data.success) {
                toast.success("Booking cancelled");
                fetchBookings();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel booking");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (bookings.length === 0) return (
        <div className="text-center py-20">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No Bookings Yet</h3>
            <p className="text-muted-foreground">Start your journey by exploring Kerala's stays!</p>
            <Button variant="outline" className="mt-6 rounded-xl" onClick={() => window.location.href = '/stay'}>
                Explore Stays
            </Button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <p className="text-muted-foreground">Manage your stay reservations and travel history.</p>
            </div>

            <div className="grid gap-8">
                {bookings.map((booking) => (
                    <div key={booking._id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Visual Side */}
                            <div className="md:w-80 relative h-64 md:h-auto overflow-hidden">
                                <img
                                    src={booking.stayId?.image || '/placeholder-stay.jpg'}
                                    alt={booking.stayId?.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <Badge className={cn(
                                        "rounded-lg px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-lg text-xs font-bold uppercase tracking-widest",
                                        booking.status === 'confirmed' ? 'bg-emerald-500/90 text-white' :
                                            booking.status === 'pending' ? 'bg-amber-500/90 text-white' :
                                                'bg-red-500/90 text-white'
                                    )}>
                                        {booking.status}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="font-bold text-lg leading-tight">{booking.stayId?.name}</p>
                                    <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" /> {booking.stayId?.district}, Kerala
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Details Side */}
                            <div className="flex-1 p-8 flex flex-col justify-between relative bg-[url('/subtle-pattern.png')]">
                                {/* Perforated Line Effect for Mobile */}
                                <div className="md:hidden absolute top-0 left-0 right-0 h-4 bg-white -mt-2 rounded-b-xl border-b border-dashed border-gray-200" />

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Check In</p>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none">{format(new Date(booking.checkIn), "MMM dd")}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{format(new Date(booking.checkIn), "yyyy")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Check Out</p>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-rose-50 text-rose-600 p-2 rounded-xl">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none">{format(new Date(booking.checkOut), "MMM dd")}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{format(new Date(booking.checkOut), "yyyy")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 border-t border-dashed border-gray-200 pt-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Guests</p>
                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            {booking.guests?.adults + (booking.guests?.children || 0)} <span className="text-xs font-normal text-gray-500">Person(s)</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Room</p>
                                        <p className="font-bold text-gray-900 capitalize">{booking.roomType}</p>
                                    </div>
                                </div>

                                {booking.status === 'pending' && (
                                    <div className="absolute top-8 right-8">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                            onClick={() => cancelBooking(booking._id)}
                                        >
                                            <Ban className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
