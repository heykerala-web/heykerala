"use client";

import { useState } from "react";
import { Star, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { reviewService } from "@/services/reviewService";
import toast from "react-hot-toast";

interface ReviewFormProps {
    targetId: string;
    targetType: "place" | "stay" | "event";
    onReviewAdded: (newReview: any) => void;
    initialData?: {
        _id: string;
        rating: number;
        title?: string;
        comment: string;
    };
    onClose?: () => void;
}

export default function ReviewForm({
    targetId,
    targetType,
    onReviewAdded,
    initialData,
    onClose
}: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState(initialData?.title || "");
    const [comment, setComment] = useState(initialData?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!initialData;

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
        try {
            let result;
            if (isEditing) {
                result = await reviewService.updateReview(initialData._id, {
                    rating,
                    title,
                    comment,
                });
            } else {
                result = await reviewService.createReview({
                    targetId,
                    targetType,
                    rating,
                    title,
                    comment,
                });
            }

            if (result.success) {
                toast.success(isEditing ? "Review updated!" : "Review submitted!");
                if (!isEditing) {
                    setRating(0);
                    setTitle("");
                    setComment("");
                }
                if (onReviewAdded) onReviewAdded(result.data.data || result.data);
                if (onClose) onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`bg-white ${isEditing ? "" : "p-10 rounded-[2.5rem] shadow-xl border border-gray-100 mb-12"}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">
                    {isEditing ? "Edit Your Review" : `Share Your Experience`}
                </h3>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">How would you rate it?</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-all hover:scale-125"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`h-10 w-10 ${star <= (hoverRating || rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-100"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Review Title (Optional)</label>
                    <Input
                        placeholder="Summarize your visit..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg"
                    />
                </div>

                {/* Comment */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Detailed Review</label>
                    <Textarea
                        placeholder="Tell others what you loved or what could be improved..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[160px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg resize-none"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-primary/20 flex gap-3"
                >
                    {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            {isEditing ? "Update Review" : "Post Review"}
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
