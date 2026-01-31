"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

interface GlobalContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showError: (message: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showError = (message: string) => {
        toast.error(message);
    };

    return (
        <GlobalContext.Provider value={{ isLoading, setIsLoading, showError }}>
            <AuthProvider>
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                )}
                {children}
            </AuthProvider>
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
};
