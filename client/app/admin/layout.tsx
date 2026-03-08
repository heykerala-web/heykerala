"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    const isRootAdmin = pathname === "/admin";

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/admin/login");
            } else if (user.role !== "Admin") {
                console.warn("Access Denied: User is not Admin", user.role);
                router.push("/");
            } else {
                setAuthorized(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !authorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="pl-72 flex-1 transition-all duration-300">
                <main className="p-8 max-w-7xl mx-auto">
                    {!isRootAdmin && (
                        <button
                            onClick={() => router.back()}
                            className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-200 hover:shadow-md active:scale-95 transition-all duration-200 group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                            Back
                        </button>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
