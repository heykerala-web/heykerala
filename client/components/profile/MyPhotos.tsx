"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Loader2, Trash2, MapPin, Eye, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface MyPhoto {
    _id: string;
    image: string;
    caption?: string;
    status: "pending" | "approved" | "rejected";
    place: {
        _id: string;
        name: string;
        district: string;
    };
    createdAt: string;
}

export default function MyPhotos() {
    const [photos, setPhotos] = useState<MyPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPhotos = async () => {
        try {
            const res = await api.get("/place-photos/user/me");
            if (res.data.success) {
                setPhotos(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch user photos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this photo?")) return;

        try {
            setDeletingId(id);
            const res = await api.delete(`/place-photos/${id}`);
            if (res.data.success) {
                toast.success("Photo deleted successfully");
                setPhotos((prev) => prev.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete photo", error);
            toast.error("Failed to delete photo");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Photos</h2>
                <p className="text-gray-500 font-medium mt-2">Manage the moments you've shared with the community.</p>
            </div>

            {photos.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Camera className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No photos uploaded yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Your gallery is empty. Visit places and upload your favorite clicks to start building your travel portfolio.
                    </p>
                    <Button variant="outline" className="rounded-xl border-gray-200" disabled>
                        Visit a Place to Upload
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                        <div key={photo._id} className="group relative bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            {/* Image Aspect */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={photo.image}
                                    alt={photo.caption || photo.place?.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute top-4 left-4">
                                    <Badge
                                        className={`backdrop-blur-md border border-white/10 shadow-lg font-bold uppercase tracking-widest text-[10px] ${photo.status === 'approved' ? 'bg-emerald-500/90 text-white' :
                                                photo.status === 'rejected' ? 'bg-red-500/90 text-white' :
                                                    'bg-amber-500/90 text-white'
                                            }`}
                                    >
                                        {photo.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        {photo.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                                        {photo.status}
                                    </Badge>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">
                                        <MapPin className="w-3 h-3" /> {photo.place?.name}
                                    </div>
                                    {photo.caption ? (
                                        <p className="text-sm font-medium line-clamp-2 text-white/90">"{photo.caption}"</p>
                                    ) : (
                                        <p className="text-xs text-white/50 italic">No caption</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {format(new Date(photo.createdAt), "MMM d, yyyy")}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(photo._id)}
                                    disabled={deletingId === photo._id}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 px-3"
                                >
                                    {deletingId === photo._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
