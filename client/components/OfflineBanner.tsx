"use client";

import React from "react";
import { useOffline } from "@/hooks/useOffline";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
    const isOffline = useOffline();

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-orange-500 text-white py-2 px-4 text-center flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                >
                    <WifiOff className="w-4 h-4" />
                    <span>You are offline. Showing saved content.</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
