import api from "./api";
import { Review, CreateReviewData, UpdateReviewData } from "../types/review";

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

    getReviews: async (targetId: string, page = 1, limit = 5) => {
        try {
            const response = await api.get(`/reviews/${targetId}`, {
                params: { page, limit }
            });
            return { success: true, ...response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch reviews",
            };
        }
    },

    updateReview: async (id: string, data: UpdateReviewData) => {
        try {
            const response = await api.put(`/reviews/${id}`, data);
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update review",
            };
        }
    },

    deleteReview: async (id: string) => {
        try {
            const response = await api.delete(`/reviews/${id}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to delete review",
            };
        }
    },

    getRatingBreakdown: async (targetId: string) => {
        try {
            const response = await api.get(`/reviews/breakdown/${targetId}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch rating breakdown",
            };
        }
    },

    // Kept for backward compatibility if needed, but redirects to getReviews
    getReviewsByPlace: async (placeId: string) => {
        return reviewService.getReviews(placeId);
    }
};
