import api from "./api";
import { Review, CreateReviewData } from "../types/review";

export const reviewService = {
    createReview: async (data: CreateReviewData) => {
        try {
            const response = await api.post("/reviews", data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to submit review",
            };
        }
    },

    getReviewsByPlace: async (placeId: string) => {
        try {
            const response = await api.get(`/reviews/place/${placeId}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch reviews",
            };
        }
    },
};
