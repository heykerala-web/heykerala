"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/services/reviewService";
import toast from "react-hot-toast";

interface ReviewFormProps {
    placeId: string;
    onReviewAdded: (newReview: any) => void;
}

export default function ReviewForm({ placeId, onReviewAdded }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setIsSubmitting(true);
        const result = await reviewService.createReview({
            placeId,
            rating,
            comment,
        });

        if (result.success) {
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment("");
            if (onReviewAdded) onReviewAdded(result.data.data); // result.data is the axios response data, which has success, data
        } else {
            toast.error(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hoverRating || rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-200"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Experience</label>
                    <Textarea
                        placeholder="Share your thoughts about this place..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl transition-all"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
            </form>
        </div>
    );
}
