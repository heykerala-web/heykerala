"use client";

import { useAuth } from "@/context/AuthContext";
import {
    Trophy,
    Calendar,
    MapPin,
    CheckCircle2,
    Clock,
    Heart,
    PlusCircle,
    CalendarCheck
} from "lucide-react";
import { format } from "date-fns";

const StatCard = ({ label, value, icon: Icon, color, delay }: any) => (
    <div className={`bg-white border border-gray-100 rounded-[2rem] p-8 flex items-center gap-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-inner`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

export default function ProfileOverview() {
    const { user } = useAuth();

    if (!user) return null;

    const stats = user.stats || { bookings: 0, contributions: 0, saved: 0 };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-emerald-950 p-8 md:p-12 text-white shadow-2xl">
                {/* Abstract Background Pattern */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                            <img
                                src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : '/default-avatar.png'}
                                alt={user.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-950 p-3 rounded-2xl shadow-lg rotate-3 group-hover:rotate-12 transition-transform duration-300">
                            <Trophy className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 pt-2">
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-center md:justify-start mb-2">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{user.name}</h1>
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-emerald-200 text-xs font-bold rounded-full uppercase tracking-widest">
                                    {user.travelBadge || "Explorer"}
                                </span>
                            </div>
                            <p className="text-emerald-200/80 flex items-center justify-center md:justify-start gap-2 font-medium">
                                <Calendar className="w-4 h-4" />
                                Member since {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently'}
                            </p>
                        </div>

                        {user.bio && (
                            <p className="text-lg text-white/90 font-light leading-relaxed max-w-2xl mx-auto md:mx-0">
                                "{user.bio}"
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Bookings"
                    value={stats.bookings}
                    icon={CalendarCheck}
                    color="bg-purple-500 shadow-purple-500/30"
                    delay="0ms"
                />
                <StatCard
                    label="Contributions"
                    value={stats.contributions}
                    icon={PlusCircle}
                    color="bg-emerald-500 shadow-emerald-500/30"
                    delay="100ms"
                />
                <StatCard
                    label="Saved Items"
                    value={stats.saved}
                    icon={Heart}
                    color="bg-rose-500 shadow-rose-500/30"
                    delay="200ms"
                />
            </div>

            {/* Badges Section */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center gap-4 text-center group">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-emerald-100 group-hover:scale-110 transition-transform duration-500">
                            <MapPin className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Verified Local</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Unlocked</p>
                        </div>
                    </div>
                    {/* Locked Badges */}
                    {[
                        { label: "Early Bird", icon: Clock },
                        { label: "Elite Blogger", icon: CheckCircle2 },
                        { label: "Trailblazer", icon: MapPin }
                    ].map((badge, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 text-center grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-help">
                            <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center border-4 border-transparent border-dashed">
                                <badge.icon className="w-10 h-10" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{badge.label}</p>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Locked</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
