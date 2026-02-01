"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Bell, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get("/users/notifications");
                if (data.success) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                // Ignore for now as it's a placeholder
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (notifications.length === 0) return (
        <div className="text-center py-20 px-4">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">You're all caught up!</h3>
            <p className="text-muted-foreground">When you have new alerts about your bookings or contributions, they'll appear here.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">Notifications</h2>
                <p className="text-muted-foreground">Stay updated with your travel activities and alerts.</p>
            </div>

            <div className="grid gap-4">
                {notifications.map((notif) => (
                    <div
                        key={notif._id}
                        className={`p-6 rounded-3xl border flex gap-6 items-start transition-all duration-300 ${notif.read ? 'bg-white border-gray-100 hover:shadow-md' : 'bg-emerald-50/50 border-emerald-100 shadow-sm hover:shadow-md'}`}
                    >
                        <div className={`shrink-0 p-3 rounded-2xl ${notif.read ? 'bg-gray-100' : 'bg-emerald-100'}`}>
                            <NotificationIcon type={notif.type} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`font-bold text-lg mb-1 ${notif.read ? 'text-gray-900' : 'text-emerald-950'}`}>{notif.title}</h4>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{format(new Date(notif.createdAt), 'MMM d')}</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotificationIcon({ type }: { type: string }) {
    switch (type) {
        case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />;
        case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />;
        case 'error': return <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
        default: return <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
    }
}
