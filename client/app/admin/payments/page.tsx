"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, User, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminPaymentVerification() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || (user as any).role !== "Admin")) {
            router.push("/login");
            return;
        }

        fetchPayments();
    }, [user, authLoading]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/payments/manual");
            if (res.data.success) {
                setPayments(res.data.payments);
            }
        } catch (error) {
            toast({ title: "Failed to fetch payments", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (bookingId: string, status: 'verified' | 'rejected') => {
        try {
            setActionLoading(bookingId);
            const res = await api.post("/admin/payments/manual/verify", { bookingId, status });
            if (res.data.success) {
                toast({ title: `Payment ${status === 'verified' ? 'Verified' : 'Rejected'}` });
                setPayments(prev => prev.filter(p => p._id !== bookingId));
            }
        } catch (error) {
            toast({ title: "Action failed", variant: "destructive" });
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manual Payment Verification</h1>
                <Badge variant="outline" className="px-4 py-1 text-sm">{payments.length} Pending</Badge>
            </div>

            {payments.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
                    <p className="text-gray-500 font-medium">No pending manual payments to verify.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {payments.map((payment) => (
                        <div key={payment._id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                {/* User & Stay Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{payment.userId?.name || "Unknown User"}</p>
                                            <p className="text-xs text-gray-400">{payment.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">Booked on {new Date(payment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-4 md:border-x md:border-gray-100 md:px-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Amount</span>
                                        <span className="text-2xl font-black text-primary">₹{payment.totalPrice}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Transaction ID / UTR</span>
                                        <p className="font-mono font-bold text-gray-700 select-all">{payment.manualPaymentRef}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 items-center justify-end">
                                    <Button
                                        variant="outline"
                                        className="rounded-2xl h-14 px-6 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                                        onClick={() => handleVerify(payment._id, 'rejected')}
                                        disabled={actionLoading === payment._id}
                                    >
                                        <XCircle className="h-5 w-5 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="rounded-2xl h-14 px-8 bg-green-600 hover:bg-green-700 font-bold"
                                        onClick={() => handleVerify(payment._id, 'verified')}
                                        disabled={actionLoading === payment._id}
                                    >
                                        {actionLoading === payment._id ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                Confirm Payment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
