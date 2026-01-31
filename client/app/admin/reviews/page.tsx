"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Star, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewType {
    _id: string;
    comment: string;
    rating: number;
    user: { _id: string; name: string; email: string };
    place: { _id: string; name: string };
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get("/admin/reviews");
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews((prev) => prev.filter((r) => r._id !== id));
            toast.success("Review deleted");
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Reviews</h1>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Place</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review._id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium flex items-center gap-1">
                                                <User className="w-3 h-3" /> {review.user?.name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-gray-400">{review.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin className="w-3 h-3" />
                                            {review.place?.name || "Unknown"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-3 h-3 fill-current mr-1" />
                                            {review.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate" title={review.comment}>
                                        {review.comment}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(review._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
