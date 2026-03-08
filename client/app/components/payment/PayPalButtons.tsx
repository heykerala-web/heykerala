"use client";

import { useEffect, useRef } from 'react';
import { stayService } from '@/services/stayService';

interface PayPalButtonsProps {
    bookingId: string;
    amount: number;
    onSuccess: (details: any) => void;
    onError: (err: any) => void;
}

export default function PayPalButtons({ bookingId, amount, onSuccess, onError }: PayPalButtonsProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).paypal && buttonRef.current) {
            // Clear existing buttons if any
            buttonRef.current.innerHTML = '';

            (window as any).paypal.Buttons({
                createOrder: async () => {
                    try {
                        const res = await stayService.createPayPalOrder(bookingId);
                        if (res.success && res.orderId) {
                            return res.orderId;
                        }
                        throw new Error('Failed to create PayPal order');
                    } catch (err) {
                        console.error('PayPal createOrder error:', err);
                        onError(err);
                        throw err;
                    }
                },
                onApprove: async (data: any, actions: any) => {
                    try {
                        const res = await stayService.capturePayPalPayment(data.orderID, bookingId);
                        if (res.success) {
                            onSuccess(res);
                        } else {
                            throw new Error('Failed to capture PayPal payment');
                        }
                    } catch (err) {
                        console.error('PayPal onApprove error:', err);
                        onError(err);
                    }
                },
                onError: (err: any) => {
                    console.error('PayPal SDK error:', err);
                    onError(err);
                },
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                }
            }).render(buttonRef.current);
        }
    }, [bookingId, amount, onSuccess, onError]);

    return <div ref={buttonRef} className="w-full min-h-[150px]" />;
}
