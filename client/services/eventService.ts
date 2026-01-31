import api from './api';
import { API_URL } from '../lib/api';

export interface Event {
    _id: string;
    title: string;
    description: string;
    category: string;
    district: string;
    venue: string;
    startDate: string;
    endDate: string;
    time: string;
    images: string[];
    latitude?: number;
    longitude?: number;
    createdAt: string;
}

export interface EventParams {
    district?: string;
    category?: string;
    date?: string;
    search?: string;
}

export const eventService = {
    getAll: async (params?: EventParams) => {
        const response = await api.get('/events', { params });
        return response.data; // Returns { success, data }
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

            const res = await fetch(`${API_URL}/events/${id}`, {
                cache: 'no-store',
                headers
            });

            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error('Failed to fetch event');
            }

            return await res.json();
        } catch (error) {
            console.error("Error in getById:", error);
            return null;
        }
    },

    create: async (data: Partial<Event>) => {
        const response = await api.post('/events', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Event>) => {
        const response = await api.put(`/events/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    submit: async (data: any) => {
        const response = await api.post('/events/user/submission', data);
        return response.data;
    }
};
