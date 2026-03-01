"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Clock, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContributorManagePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || (user.role !== "Contributor" && user.role !== "Admin"))) {
            router.replace("/login");
        }
    }, [user, authLoading, router]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await api.get("/bookings/contributor");
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleUpdateStatus = async (bookingId: string, status: string) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status });
            toast({ title: `Booking ${status}` });
            fetchBookings();
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    if (loading || authLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    const stayBookings = bookings.filter(b => b.stayId);
    const restaurantBookings = bookings.filter(b => b.restaurantId);

    return (
        <div className="container mx-auto py-10 px-4 mt-20">
            <h1 className="text-4xl font-black mb-8">Manage Your Bookings</h1>

            <Tabs defaultValue="stays" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="stays">Stays & Hotels</TabsTrigger>
                    <TabsTrigger value="restaurants">Table Reservations</TabsTrigger>
                </TabsList>

                <TabsContent value="stays">
                    <div className="grid gap-6">
                        {stayBookings.map((booking) => (
                            <div key={booking._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>{booking.status.toUpperCase()}</Badge>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none">
                                            <CreditCard className="h-3 w-3 mr-1" /> {booking.paymentStatus.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold">{booking.stayId?.name} - {booking.roomType}</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2"><User className="h-4 w-4" /> {booking.userId?.name} ({booking.guests.adults} Adults)</div>
                                        <div className="font-black text-gray-900">Total: ₹{booking.totalPrice}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {booking.status === 'pending' && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus(booking._id, 'confirmed')} className="flex-1 md:flex-none">Confirm</Button>
                                            <Button onClick={() => handleUpdateStatus(booking._id, 'rejected')} variant="outline" className="flex-1 md:flex-none">Reject</Button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button onClick={() => handleUpdateStatus(booking._id, 'completed')} variant="secondary" className="flex-1 md:flex-none">Mark Completed</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {stayBookings.length === 0 && <p className="text-gray-400">No stay bookings yet.</p>}
                    </div>
                </TabsContent>

                <TabsContent value="restaurants">
                    <div className="grid gap-6">
                        {restaurantBookings.map((booking) => (
                            <div key={booking._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>{booking.status.toUpperCase()}</Badge>
                                    </div>
                                    <h3 className="text-xl font-bold">{booking.restaurantId?.name}</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</div>
                                        <div className="flex items-center gap-2"><User className="h-4 w-4" /> {booking.userId?.name} ({booking.numberOfGuests} Guests)</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {booking.status === 'pending' && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus(booking._id, 'confirmed')} className="flex-1 md:flex-none">Approve</Button>
                                            <Button onClick={() => handleUpdateStatus(booking._id, 'rejected')} variant="outline" className="flex-1 md:flex-none">Decline</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {restaurantBookings.length === 0 && <p className="text-gray-400">No table reservations yet.</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
