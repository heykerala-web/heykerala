"use client";

import { useState } from "react";
import { Star, MoreVertical, Edit2, Trash2, ChevronDown } from "lucide-react";
import { Review } from "@/types/review";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "./ReviewForm";
import { reviewService } from "@/services/reviewService";
import toast from "react-hot-toast";

interface ReviewListProps {
    reviews: Review[];
    totalReviews: number;
    hasMore: boolean;
    onLoadMore: () => void;
    onReviewDeleted: (id: string) => void;
    onReviewUpdated: (updatedReview: any) => void;
    isLoadingMore?: boolean;
}

export default function ReviewList({
    reviews,
    totalReviews,
    hasMore,
    onLoadMore,
    onReviewDeleted,
    onReviewUpdated,
    isLoadingMore
}: ReviewListProps) {
    const { user } = useAuth();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const res = await reviewService.deleteReview(id);
            if (res.success) {
                toast.success("Review deleted");
                onReviewDeleted(id);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="space-y-8">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white p-10 rounded-[2.5rem] shadow-[0_16px_48px_-8px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-10 transition-all hover:shadow-2xl hover:border-gray-200 group relative overflow-hidden">
                        {/* Status Blur */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                        {/* User info */}
                        <div className="flex md:flex-col items-center md:items-center gap-6 md:w-32 shrink-0 relative z-10">
                            <div className="relative">
                                <Avatar className="h-20 w-20 border-4 border-white shadow-2xl ring-1 ring-gray-100">
                                    <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                                        {review.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="md:text-center shrink-0">
                                <h4 className="font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{review.user?.name || "Anonymous"}</h4>
                                <div className="flex items-center md:justify-center gap-1.5 mt-1.5">
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                        Explorer
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10">
                            {editingId === review._id ? (
                                <ReviewForm
                                    targetId={review.targetId}
                                    targetType={review.targetType}
                                    initialData={review}
                                    onReviewAdded={(updated) => {
                                        onReviewUpdated(updated);
                                        setEditingId(null);
                                    }}
                                    onClose={() => setEditingId(null)}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-1 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-100">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-gray-200" />
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    {review.createdAt ? formatRelative(new Date(review.createdAt), new Date()) : ""}
                                                </span>
                                            </div>
                                            {review.title && (
                                                <h5 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{review.title}</h5>
                                            )}
                                        </div>

                                        {(user?.id === review.user?._id || user?.role === "Admin") && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
                                                        <MoreVertical className="h-5 w-5 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 p-2 min-w-[160px] shadow-2xl">
                                                    {user?.id === review.user?._id && (
                                                        <DropdownMenuItem
                                                            onClick={() => setEditingId(review._id)}
                                                            className="flex gap-3 text-sm font-bold p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                                                        >
                                                            <Edit2 className="h-4 w-4" /> Edit Experience
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(review._id)}
                                                        className="flex gap-3 text-sm font-bold p-3 rounded-xl hover:bg-destructive/5 text-destructive focus:text-destructive transition-all cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete Review
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-6 top-0 text-6xl text-gray-50 font-serif pointer-events-none select-none">“</div>
                                        <p className="text-gray-600 leading-relaxed text-xl font-medium whitespace-pre-wrap max-w-3xl">
                                            {review.comment}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        variant="outline"
                        className="h-14 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 flex gap-3 text-lg font-bold transition-all"
                    >
                        {isLoadingMore ? (
                            <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <>
                                Load More Reviews
                                <ChevronDown className="h-5 w-5" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
