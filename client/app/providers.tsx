"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <LanguageProvider>
                <AuthProvider>
                    {/* @ts-ignore */}
                    <Toaster position="top-right" />
                    {children}
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
