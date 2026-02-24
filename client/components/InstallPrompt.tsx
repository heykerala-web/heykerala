"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can add to home screen
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // Check if app is already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setShowPrompt(false);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[999] bg-white rounded-xl shadow-2xl border border-teal-100 p-4 flex flex-col gap-3"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                <Download className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Install HeyKerala</h3>
                                <p className="text-sm text-gray-500">Access Kerala's best guide instantly from your home screen.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <Button
                        onClick={handleInstallClick}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6"
                    >
                        Install App
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
