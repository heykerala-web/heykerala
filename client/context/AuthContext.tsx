"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, tokenManager, getAvatarUrl } from "../lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: "Admin" | "Tourist" | "Contributor";
    avatar?: string;
    bio?: string;
    phone?: string;
    location?: string;
    travelBadge?: string;
    persona?: string;
    travelInterests?: string[];
    savedPlaces?: any[];
    // ...
    savedStays?: any[];
    savedEvents?: any[];
    bankDetails?: {
        accountNumber?: string;
        ifscCode?: string;
        accountHolderName?: string;
        bankName?: string;
    };
    stats?: {
        bookings: number;
        contributions: number;
        saved: number;
    };
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => void;
    register: (data: any) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadUser = async () => {
        const token = tokenManager.get();
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await authAPI.getMe(token);
            if (res.success && res.user) {
                setUser(res.user as User);
                // Cache the user in localStorage for offline resilience
                try {
                    localStorage.setItem("cached_user", JSON.stringify(res.user));
                } catch { }
            } else {
                setUser(null);
                tokenManager.remove();
                localStorage.removeItem("cached_user");
            }
        } catch (error: any) {
            console.error("Auth check failed:", error);

            // If offline or network error, try to restore user from localStorage cache
            const isNetworkError =
                !navigator.onLine ||
                error?.message === "Network Error" ||
                error?.code === "ERR_NETWORK" ||
                error?.code === "ERR_INTERNET_DISCONNECTED";

            if (isNetworkError) {
                try {
                    const cachedUserStr = localStorage.getItem("cached_user");
                    if (cachedUserStr) {
                        const cachedUser = JSON.parse(cachedUserStr);
                        console.log("[Auth] Offline – restoring user from cache");
                        setUser(cachedUser as User);
                        setLoading(false);
                        return;
                    }
                } catch { }
            }

            // Clear user only if it's a real auth failure (not just network)
            if (!isNetworkError) {
                setUser(null);
                tokenManager.remove();
                localStorage.removeItem("cached_user");
            } else {
                // Offline with no cache — keep loading:false but don't force logout
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();

        const handleAuthChange = () => {
            loadUser();
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "token") {
                loadUser();
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("auth", handleAuthChange);
            window.addEventListener("storage", handleStorageChange);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("auth", handleAuthChange);
                window.removeEventListener("storage", handleStorageChange);
            }
        };
    }, []);

    const login = (data: any) => {
        tokenManager.set(data.token);
        setUser(data.user);
        if (data.user.role === "Admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };

    const register = (data: any) => {
        tokenManager.set(data.token);
        setUser(data.user);
        if (data.user.role === "Admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
    };

    const logout = () => {
        tokenManager.remove();
        setUser(null);
        router.push("/login"); // or refresh? router.push is better for SPA feel
        router.refresh();
    };

    const updateUser = (updatedUser: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
