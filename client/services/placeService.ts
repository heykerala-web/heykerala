import api from './api';
import { API_URL } from '../lib/api';

export interface Place {
    _id: string;
    name: string;
    slug: string;
    district: string;
    category: string;
    description: string;
    image: string;
    images: string[];
    location: string;
    ratingAvg: number;
    totalReviews: number;
    views?: number;
    bookmarks?: number;
    searchClicks?: number;
    tags: string[];
    latitude: number;
    longitude: number;
    openingHours?: string;
    createdAt: string;
}

export interface PlaceParams {
    page?: number;
    limit?: number;
    category?: string;
    district?: string;
    search?: string;
    sort?: string;
    minRating?: number;
}

export const placeService = {
    getAll: async (params?: PlaceParams) => {
        const response = await api.get('/places', { params });
        return response.data; // This returns { success, data, pagination }
    },

    getTrending: async () => {
        const response = await api.get('/places/trending');
        return response.data;
    },

    getById: async (id: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_URL}/places/${id}`, {
                cache: 'no-store',
                headers
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to fetch place');
            }

            return await res.json();
        } catch (error) {
            console.error("Error in getById:", error);
            return { success: false, message: "Failed to load place" };
        }
    },

    getBySlug: async (slug: string) => {
        const response = await api.get(`/places/slug/${slug}`);
        return response.data;
    },

    getNearby: async (id: string) => {
        const response = await api.get(`/places/${id}/nearby`);
        return response.data;
    },

    submit: async (data: any) => {
        const response = await api.post('/places/user/submission', data);
        return response.data;
    },

    recordView: async (id: string) => {
        try {
            await api.post(`/places/${id}/view`);
        } catch (error) {
            // silent fail for interaction tracking
        }
    },

    recordSearchClick: async (id: string) => {
        try {
            await api.post(`/places/${id}/search-click`);
        } catch (error) {
            // silent fail
        }
    },

    recordBookmark: async (id: string) => {
        try {
            await api.post(`/places/${id}/bookmark-click`);
        } catch (error) {
            // silent fail
        }
    }
};
