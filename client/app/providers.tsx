"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
                {/* @ts-ignore */}
                <Toaster position="top-right" />
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}
