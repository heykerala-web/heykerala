"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    BookOpen,
    Heart,
    PlusCircle,
    MessageSquare,
    ShieldCheck,
    Bell,
    Camera
} from "lucide-react";

export default function ProfileLayout({ children, activeTab, setActiveTab }: {
    children: React.ReactNode,
    activeTab: string,
    setActiveTab: (tab: string) => void
}) {
    const { logout } = useAuth();

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "personal", label: "Info", icon: User },
        { id: "bookings", label: "Bookings", icon: BookOpen },
        { id: "saved", label: "Saved", icon: Heart },
        { id: "contributions", label: "Posts", icon: PlusCircle },
        { id: "photos", label: "Photos", icon: Camera },
        { id: "reviews", label: "Reviews", icon: MessageSquare },
        { id: "security", label: "Security", icon: ShieldCheck },
        { id: "notifications", label: "Alerts", icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-12">
            {/* Cinematic Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 py-12 relative z-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:w-72 shrink-0">
                        <ProfileSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            logout={logout}
                        />
                    </div>

                    {/* Mobile Tabs (Scrollable) */}
                    <div className="lg:hidden overflow-x-auto no-scrollbar flex gap-2 pb-4 mb-4 -mx-4 px-4 scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                                    activeTab === tab.id
                                        ? "bg-emerald-950 text-white shadow-lg shadow-emerald-950/20"
                                        : "bg-white text-gray-500 border border-gray-100 shadow-sm"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] min-h-[600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
