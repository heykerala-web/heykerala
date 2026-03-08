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
    image?: string;
    latitude?: number;
    longitude?: number;
    ratingAvg: number;
    ratingCount: number;
    status: 'pending' | 'approved' | 'rejected';
    eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    viewCount: number;
    reminderCount: number;
    isFeatured: boolean;
    ticketUrl?: string;
    hasReminder?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EventParams {
    district?: string;
    category?: string;
    date?: string;
    search?: string;
    timeFilter?: string;
    eventStatus?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const eventService = {
    getAll: async (params?: EventParams) => {
        const response = await api.get('/events', { params });
        return response.data;
    },

    getById: async (id: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store', headers });
            if (!res.ok) { if (res.status === 404) return null; throw new Error('Failed to fetch event'); }
            return await res.json();
        } catch (error) { console.error("Error in getById:", error); return null; }
    },

    // ── Smart Endpoints ──────────────────────────────────────────
    getTrending: async () => {
        const response = await api.get('/events/trending');
        return response.data;
    },

    getFeatured: async () => {
        const response = await api.get('/events/featured');
        return response.data;
    },

    getCalendarEvents: async (month: number, year: number, district?: string) => {
        const response = await api.get('/events/calendar', { params: { month, year, district } });
        return response.data;
    },

    getAIRecommendations: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await api.get('/events/user/ai-recommendations', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    getMyReminders: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await api.get('/events/user/my-reminders', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    // ── Reminder ─────────────────────────────────────────────────
    setReminder: async (eventId: string, reminderTime: string, notificationMethod: string) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await api.post(`/events/${eventId}/remind`,
            { reminderTime, notificationMethod },
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        return response.data;
    },

    removeReminder: async (eventId: string) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await api.delete(`/events/${eventId}/remind`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    // ── Admin ────────────────────────────────────────────────────
    create: async (data: Partial<Event>) => { const r = await api.post('/events', data); return r.data; },
    update: async (id: string, data: Partial<Event>) => { const r = await api.put(`/events/${id}`, data); return r.data; },
    delete: async (id: string) => { const r = await api.delete(`/events/${id}`); return r.data; },
    submit: async (data: any) => { const r = await api.post('/events/user/submission', data); return r.data; },
    toggleFeatured: async (id: string) => { const r = await api.put(`/events/${id}/featured`, {}); return r.data; },
    autoExpire: async () => { const r = await api.post('/events/admin/auto-expire', {}); return r.data; },

    bulkUpload: async (events: any[]) => {
        const r = await api.post('/events/admin/bulk-upload', { events });
        return r.data;
    }
};
