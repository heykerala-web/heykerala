"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function PremiumCard({
    children,
    className,
    hoverEffect = true,
    ...props
}: PremiumCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-[2rem] bg-white border border-transparent shadow-sm transition-all duration-500",
                hoverEffect && "hover:shadow-2xl hover:-translate-y-2 hover:border-primary/10",
                className
            )}
            {...props}
        >
            {/* Glassmorphic Overlay on Hover (Optional) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {children}
        </div>
    );
}

import { SmartImage } from "./SmartImage";

export function PremiumCardImage({
    src,
    alt,
    category = 'default',
    className
}: {
    src: string | null | undefined;
    alt: string;
    category?: 'restaurant' | 'place' | 'stay' | 'event' | 'default';
    className?: string
}) {
    return (
        <div className="overflow-hidden h-full w-full">
            <SmartImage
                src={src}
                alt={alt}
                category={category}
                className={cn("transition-transform duration-700 hover:scale-110", className)}
                aspectRatio="none" // Parent controls dimensions
            />
        </div>
    )
}

export function PremiumCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-6 relative z-10", className)}>
            {children}
        </div>
    )
}
