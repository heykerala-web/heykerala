"use client";

import { cn } from "@/lib/utils";
import {
    User,
    BookOpen,
    Heart,
    LayoutDashboard,
    MessageSquare,
    ShieldCheck,
    Bell,
    LogOut,
    PlusCircle,
    Camera
} from "lucide-react";

interface SidebarItemProps {
    id: string;
    label: string;
    icon: any;
    active: boolean;
    onClick: (id: string) => void;
}

const SidebarItem = ({ id, label, icon: Icon, active, onClick }: SidebarItemProps) => (
    <button
        onClick={() => onClick(id)}
        className={cn(
            "flex items-center gap-4 w-full px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-300 group",
            active
                ? "bg-emerald-950 text-white shadow-xl shadow-emerald-950/20 translate-x-2"
                : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-lg hover:shadow-gray-200/50"
        )}
    >
        <Icon className={cn("w-5 h-5 transition-colors", active ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-600")} />
        {label}
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
    </button>
);

export default function ProfileSidebar({
    activeTab,
    setActiveTab,
    logout
}: {
    activeTab: string;
    setActiveTab: (id: string) => void;
    logout: () => void;
}) {
    const mainNav = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "personal", label: "Personal Info", icon: User },
        { id: "bookings", label: "My Bookings", icon: BookOpen },
        { id: "saved", label: "Saved Places", icon: Heart },
        { id: "contributions", label: "My Contributions", icon: PlusCircle },
        { id: "photos", label: "My Photos", icon: Camera },
        { id: "reviews", label: "Reviews", icon: MessageSquare },
    ];

    const secondaryNav = [
        { id: "security", label: "Security", icon: ShieldCheck },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <aside className="w-full lg:w-72 flex flex-col gap-8 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] sticky top-24">
            <div className="space-y-3">
                <p className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Menu
                </p>
                <div className="space-y-1">
                    {mainNav.map((item) => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={activeTab === item.id}
                            onClick={setActiveTab}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <p className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Preferences
                </p>
                <div className="space-y-1">
                    {secondaryNav.map((item) => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={activeTab === item.id}
                            onClick={setActiveTab}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 w-full px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
