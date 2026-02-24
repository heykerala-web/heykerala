"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera, Grid as GridIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import UploadPhotoModal from "@/components/place/UploadPhotoModal";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface PlacePhoto {
    _id: string;
    image: string;
    caption?: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

interface PlacePhotoGalleryProps {
    targetId: string;
    targetName: string;
    targetType?: "place" | "event";
    externalPhotos?: PlacePhoto[];
    onUpdate?: () => void;
}

export default function PlacePhotoGallery({ targetId, targetName, targetType = "place", externalPhotos, onUpdate }: PlacePhotoGalleryProps) {
    const { user } = useAuth();
    const [internalPhotos, setInternalPhotos] = useState<PlacePhoto[]>([]);
    const [loading, setLoading] = useState(!externalPhotos);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const photos = externalPhotos || internalPhotos;

    const fetchPhotos = async () => {
        if (externalPhotos && onUpdate) {
            onUpdate();
            return;
        }

        try {
            const res = await api.get(`/place-photos/${targetId}?type=${targetType}`);
            if (res.data.success) {
                setInternalPhotos(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch photos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!externalPhotos) {
            fetchPhotos();
        } else {
            setLoading(false);
        }
    }, [targetId, targetType, externalPhotos]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = "auto";
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <section className="space-y-8" id="community-gallery">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Traveler Photos <span className="text-lg font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{photos.length}</span>
                    </h2>
                    <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-xs">
                        {photos.length > 0 ? "Moments shared by our community" : "Be the first to share a moment"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <UploadPhotoModal targetId={targetId} targetName={targetName} targetType={targetType} onUploadSuccess={fetchPhotos} />
                </div>
            </div>

            {photos.length === 0 ? (
                <div className="bg-gray-50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Camera className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No photos yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        This place is waiting to be discovered. Share your best shots and help others decide where to go.
                    </p>
                    <UploadPhotoModal targetId={targetId} targetName={targetName} targetType={targetType} onUploadSuccess={fetchPhotos} />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, idx) => (
                        <div
                            key={photo._id}
                            className={`relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-100 ${idx % 7 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`}
                            onClick={() => openLightbox(idx)}
                        >
                            <img
                                src={photo.image}
                                alt={photo.caption || `Photo by ${photo.user.name}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                                            {photo.user.avatar ? (
                                                <img src={photo.user.avatar.startsWith('http') ? photo.user.avatar : `http://localhost:5000${photo.user.avatar}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-400" />
                                            )}
                                        </div>
                                        <span className="text-xs font-bold truncate">{photo.user.name}</span>
                                    </div>
                                    {photo.caption && (
                                        <p className="text-sm font-medium leading-tight line-clamp-2">{photo.caption}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 text-white z-10 w-full bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                                <img
                                    src={photos[lightboxIndex].user.avatar?.startsWith('http') ? photos[lightboxIndex].user.avatar : `http://localhost:5000${photos[lightboxIndex].user.avatar}` || '/default-avatar.png'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{photos[lightboxIndex].user.name}</p>
                                <p className="text-xs text-white/50">{format(new Date(photos[lightboxIndex].createdAt), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeLightbox}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden" onClick={closeLightbox}>
                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 md:left-8 p-4 bg-black/20 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md z-20 hover:-translate-x-1"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>

                        <img
                            src={photos[lightboxIndex].image}
                            alt="Gallery preview"
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            onClick={nextImage}
                            className="absolute right-4 md:right-8 p-4 bg-black/20 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md z-20 hover:translate-x-1"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>
                    </div>

                    {/* Footer / Caption */}
                    {photos[lightboxIndex].caption && (
                        <div className="p-8 text-center bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                            <p className="text-white/90 text-lg font-medium max-w-3xl mx-auto">
                                "{photos[lightboxIndex].caption}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
