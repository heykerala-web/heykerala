import { Star } from "lucide-react";
import { Review } from "@/types/review";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                            {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900">{review.user?.name || "Anonymous"}</h4>
                                <p className="text-xs text-gray-500 font-medium">
                                    {review.createdAt ? format(new Date(review.createdAt), "MMMM d, yyyy") : ""}
                                </p>
                            </div>
                            <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
