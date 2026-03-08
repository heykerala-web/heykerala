"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Booking {
    _id: string;
    bookingId?: string;
    stayId?: { name: string; type: string };
    userId?: { name: string; email: string };
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number };
    status: string;
    paymentMethod?: string;
    packageId?: any; // mixed usage
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchBookings = async () => {
        try {
            const { data } = await api.get("/bookings/admin");
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
            toast({ title: `Booking ${status}` });
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Bookings</h1>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Booking ID</th>
                            <th className="px-6 py-3">Stay / Item</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs font-bold text-primary">
                                        {booking.bookingId || booking._id}
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                        {(booking as any).paymentMethod === 'paypal' ? 'PayPal Sandbox' : 'Razorpay'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {booking.stayId?.name || "Unknown Stay"}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize">
                                        {booking.stayId?.type || (booking.packageId ? "Package" : "Custom")}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>{booking.userId?.name || "Guest"}</div>
                                    <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {booking.checkIn ? (
                                        <>
                                            {new Date(booking.checkIn).toLocaleDateString()}
                                            {booking.checkOut && ` - ${new Date(booking.checkOut).toLocaleDateString()}`}
                                        </>
                                    ) : "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {booking.guests?.adults || 0} Ad, {booking.guests?.children || 0} Ch
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Link href={`/booking/confirmation/${booking._id}`}>
                                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <ExternalLink className="w-3 h-3 mr-1" /> View
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                        disabled={booking.status === 'confirmed'}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                        disabled={booking.status === 'rejected'}
                                    >
                                        Reject
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-6 text-gray-500">No bookings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
