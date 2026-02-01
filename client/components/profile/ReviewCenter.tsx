"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, Trash2, Loader2, Edit2, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ReviewForm from "@/components/reviews/ReviewForm";

export default function ReviewCenter() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState<any>(null);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get("/users/reviews");
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const { data } = await api.delete(`/users/reviews/${id}`);
            if (data.success) {
                toast.success("Review deleted");
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (reviews.length === 0) return (
        <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="bg-white w-20 h-20 rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Share your experiences and help others find the best spots in Kerala!</p>
            <Link href="/explore">
                <Button className="mt-8 rounded-2xl h-14 px-8 font-bold">Explore Now</Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">My Review Center</h2>
                    <p className="text-gray-500 font-medium">Manage all your ratings and shared experiences.</p>
                </div>
                <div className="bg-primary/5 text-primary px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-primary/10">
                    {reviews.length} Total Reviews
                </div>
            </div>

            <div className="grid gap-8">
                {reviews.map((review) => (
                    <Card key={review._id} className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Target Info Side */}
                                <div className="md:w-72 shrink-0 relative overflow-hidden group/img">
                                    <img
                                        src={review.target?.image || '/placeholder-place.jpg'}
                                        className="w-full h-full object-cover aspect-video md:aspect-auto min-h-[200px] transition-transform duration-700 group-hover:scale-110"
                                        alt={review.target?.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white border border-white/10">
                                                {review.targetType}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-bold text-lg line-clamp-1">{review.target?.name}</h4>
                                        <div className="flex items-center gap-1 text-white/70 text-xs">
                                            <MapPin className="w-3 h-3" />
                                            {review.target?.district}, Kerala
                                        </div>
                                    </div>
                                    <Link
                                        href={`/${review.targetType === 'place' ? 'places' : review.targetType}/${review.targetId}`}
                                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-primary transition-all shadow-xl opacity-0 group-hover:opacity-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Review Content Side */}
                                <div className="flex-1 p-8 bg-white">
                                    {editingReview?._id === review._id ? (
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <ReviewForm
                                                targetId={review.targetId}
                                                targetType={review.targetType}
                                                initialData={review}
                                                onReviewAdded={() => {
                                                    setEditingReview(null);
                                                    fetchReviews();
                                                }}
                                                onClose={() => setEditingReview(null)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-100'}`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm font-bold text-gray-900">{review.rating.toFixed(1)}</span>
                                                    </div>
                                                    {review.title && (
                                                        <h5 className="font-black text-xl text-gray-900 mb-1">{review.title}</h5>
                                                    )}
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        Shared on {format(new Date(review.createdAt), "MMMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                        onClick={() => setEditingReview(review)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full bg-gray-50 text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                        onClick={() => deleteReview(review._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap italic">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
