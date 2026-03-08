import api from './api';
import { API_URL } from '../lib/api';

export interface Room {
    _id: string;
    roomType: string;
    price: number;
    maxGuests: number;
    availableCount: number;
}

export interface RoomType {
    name: string;
    description?: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
    count: number;
}

export interface Stay {
    _id: string;
    name: string;
    type: 'hotel' | 'resort' | 'homestay' | 'restaurant' | 'cafe';
    description: string;
    district: string;
    latitude?: number;
    longitude?: number;
    images: string[];
    image?: string;
    price: number;
    roomTypes?: RoomType[];
    minStay?: number;
    amenities: string[];
    ratingAvg: number;
    ratingCount: number;
    openingTime?: string;
    closingTime?: string;
    avgDuration?: number;
    totalCapacity?: number;
    createdAt: string;
    updatedAt: string;
}

export interface StayParams {
    district?: string;
    type?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
}

export interface BookingData {
    stayId: string;
    roomType?: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children: number;
    };
    userId: string;
    totalPrice?: number;
}

export interface RestaurantBookingData {
    restaurantId: string;
    bookingDate: string;
    bookingTime: string;
    numberOfGuests: number;
    tableType?: string;
    userId: string;
}

export const stayService = {
    getAll: async (params?: StayParams) => {
        const response = await api.get('/stays', { params });
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

            const res = await fetch(`${API_URL}/stays/${id}`, {
                cache: 'no-store',
                headers
            });

            if (!res.ok) {
                // Even if 404, we might want to return null or throw
                if (res.status === 404) return null;
                throw new Error('Failed to fetch stay');
            }

            return await res.json();
        } catch (error) {
            console.error("Error in getById:", error);
            return null;
        }
    },

    createBooking: async (data: BookingData) => {
        const response = await api.post('/bookings/stay', data);
        return response.data;
    },

    createRestaurantBooking: async (data: RestaurantBookingData) => {
        const response = await api.post('/bookings/restaurant', data);
        return response.data;
    },

    createPaymentOrder: async (amount: number, bookingId: string) => {
        const response = await api.post('/payments/order', { amount, bookingId });
        return response.data;
    },

    verifyPayment: async (paymentData: any) => {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    },

    submitManualPayment: async (bookingId: string, transactionId: string) => {
        const response = await api.post('/payments/manual-submit', { bookingId, transactionId });
        return response.data;
    },

    createPayPalOrder: async (bookingId: string) => {
        const response = await api.post('/payments/paypal/create-order', { bookingId });
        return response.data;
    },

    capturePayPalPayment: async (orderId: string, bookingId: string) => {
        const response = await api.post('/payments/paypal/capture-payment', { orderId, bookingId });
        return response.data;
    },

    // User Submission
    submit: async (data: Partial<Stay>) => {
        const response = await api.post('/stays/user/submission', data);
        return response.data;
    },

    // Admin Methods
    create: async (data: Partial<Stay>) => {
        const response = await api.post('/stays', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Stay>) => {
        const response = await api.put(`/stays/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/stays/${id}`);
        return response.data;
    }
};
