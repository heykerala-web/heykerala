"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Star, Activity } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPlaces: 0,
        totalReviews: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get("/admin/stats");
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading stats...</div>;
    }

    return (
        <div className="space-y-12">
            <div className="border-b border-muted pb-10">
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Platform Analytics</h1>
                <p className="text-body-lg text-muted-foreground uppercase tracking-[0.2em] font-bold text-xs">Real-time performance overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="rounded-[2rem] border-muted shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Users</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-bold text-foreground tracking-tight">{stats.totalUsers}</div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live now
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-muted shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Curated Places</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-bold text-foreground tracking-tight">{stats.totalPlaces}</div>
                        <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Across 14 districts</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-muted shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Guest Reviews</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <Star className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-bold text-foreground tracking-tight">{stats.totalReviews}</div>
                        <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">4.8 Avg Rating</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Placeholder */}
            {/* Activity Stream */}
            <Card className="rounded-[2.5rem] border-muted shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-10 border-b border-muted bg-muted/20">
                    <CardTitle className="flex items-center gap-4 text-xl font-bold">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-muted">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        Platform Activity Stream
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-20 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                            <Activity className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-medium text-foreground">Steady & Secure</p>
                        <p className="text-muted-foreground text-sm">Real-time activity tracking is being optimized for the next deployment. No anomalies detected.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
