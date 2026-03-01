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
                // Ensure avatar is properly formatted URL if needed, though API usually sends it
                // If the API sends a relative path, we might want to process it here or in the component.
                // The Interface says avatar?: string. 
                setUser(res.user as User);
            } else {
                setUser(null);
                tokenManager.remove(); // Invalid token
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            tokenManager.remove();
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
