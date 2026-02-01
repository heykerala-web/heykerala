"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function MyContributions() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data } = await api.get("/users/submissions");
                if (data.success) {
                    setSubmissions(data.submissions);
                }
            } catch (error) {
                toast.error("Failed to fetch contributions");
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (submissions.length === 0) return (
        <div className="text-center py-20">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No contributions yet</h3>
            <p className="text-muted-foreground">Share your favorite spots in Kerala with the community!</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">My Contributions</h2>
                <p className="text-muted-foreground">Tracks the status of your submitted places, stays, and events.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((item) => (
                    <div key={item._id} className="group relative bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        {/* Image Aspect */}
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img
                                src={Array.isArray(item.images) ? item.images[0] : (item.image || '/placeholder.jpg')}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={item.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                            <div className="absolute top-4 left-4">
                                <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-gray-900 font-bold uppercase tracking-widest text-[10px] shadow-lg">
                                    {item.type}
                                </Badge>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h4 className="font-bold text-lg leading-tight mb-1 truncate">{item.name}</h4>
                                <p className="text-xs text-white/70 font-medium">
                                    Submitted {format(new Date(item.createdAt), "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <StatusBadge status={item.status || 'pending'} />
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status.toLowerCase()) {
        case 'approved':
        case 'active':
            return (
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-tight">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </div>
            );
        case 'rejected':
            return (
                <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-tight">
                    <AlertCircle className="w-3.5 h-3.5" /> Rejected
                </div>
            );
        default:
            return (
                <div className="flex items-center gap-1.5 text-yellow-600 font-bold text-xs uppercase tracking-tight">
                    <Clock className="w-3.5 h-3.5" /> Pending Review
                </div>
            );
    }
}
