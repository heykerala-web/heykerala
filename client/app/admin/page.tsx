"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Users, MapPin, Star, Activity, Clock } from "lucide-react";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPlaces: 0,
        totalReviews: 0,
    });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    api.get("/admin/stats"),
                    api.get("/admin/activity")
                ]);

                if (statsRes.data.success) {
                    setStats(statsRes.data.stats);
                }
                if (logsRes.data.success) {
                    setLogs(logsRes.data.logs);
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Analytics</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Real-time performance overview</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-bold text-slate-500">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Operational
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Users Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Users className="h-7 w-7" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <Activity className="h-3 w-3" /> +12%
                        </span>
                    </div>

                    <div className="relative z-10">
                        <div className="text-5xl font-black text-slate-900 tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{stats.totalUsers}</div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Explorers</p>
                    </div>
                </div>

                {/* Places Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <MapPin className="h-7 w-7" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            New Added
                        </span>
                    </div>

                    <div className="relative z-10">
                        <div className="text-5xl font-black text-slate-900 tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{stats.totalPlaces}</div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Curated Destinations</p>
                    </div>
                </div>

                {/* Reviews Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-colors" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                            <Star className="h-7 w-7" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                            4.8 Avg
                        </span>
                    </div>

                    <div className="relative z-10">
                        <div className="text-5xl font-black text-slate-900 tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{stats.totalReviews}</div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Guest Experiences</p>
                    </div>
                </div>
            </div>

            {/* CHARTS */}
            <AdminCharts />

            {/* Activity Stream */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        Live Activity Stream
                    </h3>
                    <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">View All</button>
                </div>

                <div className="divide-y divide-slate-100">
                    {logs.length > 0 ? (
                        logs.map((log: any) => (
                            <div key={log._id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <Activity className="h-5 w-5 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-900">{log.user?.name || "Guest"}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">{log.action}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{log.details}</p>
                                </div>
                                <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-slate-400">
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
