"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <WifiOff className="w-12 h-12 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Offline</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                It seems you've lost your connection. Reconnect to continue exploring God's Own Country.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={handleRetry}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
                <Link href="/">
                    <Button variant="outline" className="px-8 border-teal-600 text-teal-600 hover:bg-teal-50">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </Link>
            </div>

            <div className="mt-12 text-sm text-gray-400">
                Tip: Some previously visited pages may still be available offline!
            </div>
        </div>
    );
}
