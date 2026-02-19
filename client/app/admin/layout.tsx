"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            console.log("Admin Layout Check:", { user, role: user?.role });
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
                    {children}
                </main>
            </div>
        </div>
    );
}
