"use client";

import { useState, useEffect, useCallback } from "react";
import { Review } from "@/types/review";
import { reviewService } from "@/services/reviewService";
import ReviewList from "./ReviewList";
import ReviewSummary from "./ReviewSummary";
import ReviewForm from "./ReviewForm";
import { useAuth } from "@/context/AuthContext";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewSectionProps {
    targetId: string;
    targetType: "place" | "stay" | "event" | "app";
    initialRatingAvg?: number;
    initialRatingCount?: number;
}

export default function ReviewSection({
    targetId,
    targetType,
    initialRatingAvg = 0,
    initialRatingCount = 0
}: ReviewSectionProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [ratingAvg, setRatingAvg] = useState(initialRatingAvg);
    const [ratingCount, setRatingCount] = useState(initialRatingCount);
    const [breakdown, setBreakdown] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
        if (pageNum === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const res = await reviewService.getReviews(targetId, pageNum);
            if (res.success) {
                if (append) {
                    setReviews(prev => [...prev, ...res.data]);
                } else {
                    setReviews(res.data);
                }
                setHasMore(res.pagination.page < res.pagination.pages);
                setPage(res.pagination.page);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [targetId]);

    const fetchBreakdown = useCallback(async () => {
        try {
            const res = await reviewService.getRatingBreakdown(targetId);
            if (res.success) {
                setBreakdown(res.data.breakdown);
                setRatingCount(res.data.totalReviews);
                // The backend controller returns breakdown, averageRating, and totalReviews
                if (res.data.averageRating) {
                    setRatingAvg(res.data.averageRating);
                }
            }
        } catch (error) {
            console.error("Error fetching breakdown:", error);
        }
    }, [targetId]);

    useEffect(() => {
        fetchReviews(1);
        if (targetType !== "app") fetchBreakdown();
    }, [targetId, targetType, fetchReviews, fetchBreakdown]);

    const handleReviewAdded = (newReview: any) => {
        // Refresh everything to get final average/count from server or update locally
        setReviews(prev => [newReview, ...prev]);
        setRatingCount(prev => prev + 1);
        setShowForm(false);
        if (targetType !== "app") fetchBreakdown();
    };

    const handleReviewDeleted = (id: string) => {
        setReviews(prev => prev.filter(r => r._id !== id));
        setRatingCount(prev => prev - 1);
        if (targetType !== "app") fetchBreakdown();
    };

    const handleReviewUpdated = (updatedReview: any) => {
        setReviews(prev => prev.map(r => r._id === updatedReview._id ? updatedReview : r));
        if (targetType !== "app") fetchBreakdown();
    };

    const loadMore = () => {
        if (isLoadingMore || !hasMore) return;
        fetchReviews(page + 1, true);
    };

    return (
        <div className="mt-20 border-t border-gray-100 pt-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                        Guest Reviews
                    </h2>
                    <p className="text-gray-500 font-medium tracking-wide">
                        Real experiences from fellow travelers
                    </p>
                </div>

                {user && !showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 flex gap-3 transition-all"
                    >
                        <MessageSquarePlus className="h-5 w-5" />
                        Write a Review
                    </Button>
                )}
            </div>

            {showForm && (
                <div className="mb-16 animate-in slide-in-from-top-4 duration-500">
                    <ReviewForm
                        targetId={targetId}
                        targetType={targetType}
                        onReviewAdded={handleReviewAdded}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}

            {targetType !== "app" && (
                <div className="mb-12">
                    <ReviewSummary
                        ratingAvg={ratingAvg}
                        ratingCount={ratingCount}
                        breakdown={breakdown}
                    />
                </div>
            )}

            <ReviewList
                reviews={reviews}
                totalReviews={ratingCount}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onReviewDeleted={handleReviewDeleted}
                onReviewUpdated={handleReviewUpdated}
                isLoadingMore={isLoadingMore}
            />
        </div>
    );
}
