"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, MapPin, Star, LogOut, BedDouble, CalendarCheck, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Submission Reviews", href: "/admin/submissions", icon: ClipboardList },
    { name: "Places", href: "/admin/places", icon: MapPin },
    { name: "Stays (Hotels/Rest.)", href: "/admin/stays", icon: BedDouble },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Events", href: "/admin/events", icon: CalendarCheck },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="flex flex-col h-full bg-slate-900 text-white w-72 fixed left-0 top-0 bottom-0 overflow-y-auto z-50 border-r border-slate-800 shadow-2xl">
            {/* Header / Logo */}
            <div className="p-8 pb-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-xl">🌴</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            HeyKerala
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 py-6">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Overview</p>
                {sidebarItems.slice(0, 3).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    );
                })}

                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-8">Management</p>
                {sidebarItems.slice(3).map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs ring-2 ring-slate-900">
                        OP
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">Administrator</p>
                        <p className="text-xs text-slate-500 truncate">admin@heykerala.com</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
