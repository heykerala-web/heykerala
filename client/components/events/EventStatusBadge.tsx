"use client";

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

interface Props {
    status: EventStatus;
    size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<EventStatus, { label: string; emoji: string; classes: string }> = {
    upcoming: { label: 'Upcoming', emoji: '🟢', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ongoing: { label: 'Ongoing', emoji: '🔵', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { label: 'Completed', emoji: '⚫', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
    cancelled: { label: 'Cancelled', emoji: '🔴', classes: 'bg-red-50 text-red-600 border-red-200' },
};

export function EventStatusBadge({ status, size = 'sm' }: Props) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
    const sizeClass = size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-widest ${sizeClass} ${cfg.classes}`}>
            <span>{cfg.emoji}</span>
            {cfg.label}
        </span>
    );
}
