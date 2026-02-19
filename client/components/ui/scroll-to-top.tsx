"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 md:bottom-8">
            <Button
                variant="default"
                size="icon"
                onClick={scrollToTop}
                className={cn(
                    "h-12 w-12 rounded-full shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90 text-white",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
                )}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </Button>
        </div>
    );
}
