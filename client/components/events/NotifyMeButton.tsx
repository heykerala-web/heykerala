"use client";

import { useState } from "react";
import { Bell, BellOff, X, Check, Loader2 } from "lucide-react";
import { eventService } from "@/services/eventService";

interface Props {
    eventId: string;
    eventTitle: string;
    initialHasReminder?: boolean;
}

export function NotifyMeButton({ eventId, eventTitle, initialHasReminder = false }: Props) {
    const [hasReminder, setHasReminder] = useState(initialHasReminder);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [reminderTime, setReminderTime] = useState<"24h" | "1h" | "30min">("24h");
    const [method, setMethod] = useState<"in-app" | "email">("in-app");

    const handleToggle = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        if (hasReminder) {
            handleRemove();
        } else {
            setShowModal(true);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        try {
            await eventService.removeReminder(eventId);
            setHasReminder(false);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await eventService.setReminder(eventId, reminderTime, method);
            setHasReminder(true);
            setSuccess(true);
            setTimeout(() => { setSuccess(false); setShowModal(false); }, 1800);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    return (
        <>
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm
          ${hasReminder
                        ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200"
                        : "bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50"
                    }`}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" />
                    : hasReminder ? <BellOff className="h-4 w-4" />
                        : <Bell className="h-4 w-4" />
                }
                {hasReminder ? "Reminder Set" : "Notify Me"}
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div
                        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
                            <div>
                                <p className="text-teal-200 text-xs font-bold uppercase tracking-widest">Set Reminder</p>
                                <h3 className="text-white font-black text-lg line-clamp-1">{eventTitle}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white p-1">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {success ? (
                                <div className="py-6 text-center">
                                    <div className="mx-auto h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                                        <Check className="h-8 w-8 text-teal-600" />
                                    </div>
                                    <p className="font-black text-gray-900">Reminder set! 🎉</p>
                                    <p className="text-sm text-gray-500 mt-1">We&apos;ll notify you before the event.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Reminder time */}
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Remind me</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {([["24h", "24 hours before"], ["1h", "1 hour before"], ["30min", "30 min before"]] as const).map(([val, label]) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setReminderTime(val)}
                                                    className={`rounded-2xl py-3 text-sm font-bold border-2 transition-all ${reminderTime === val
                                                            ? "border-teal-600 bg-teal-50 text-teal-700"
                                                            : "border-gray-100 text-gray-600 hover:border-teal-200"
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notification method */}
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Notify via</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {([["in-app", "🔔 In-App"], ["email", "📧 Email"]] as const).map(([val, label]) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setMethod(val)}
                                                    className={`rounded-2xl py-3 text-sm font-bold border-2 transition-all ${method === val
                                                            ? "border-teal-600 bg-teal-50 text-teal-700"
                                                            : "border-gray-100 text-gray-600 hover:border-teal-200"
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bell className="h-5 w-5" />}
                                        Confirm Reminder
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
