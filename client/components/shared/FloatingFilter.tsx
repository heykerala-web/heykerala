"use client";

import { cn } from "@/lib/utils";
import { Search, ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   WRAPPER                                  */
/* -------------------------------------------------------------------------- */

export function FloatingFilterWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "container mx-auto px-4 sm:px-6 -mt-16 md:-mt-20 relative z-20 max-w-7xl animate-fade-in-up",
            className
        )}>
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 p-5 lg:p-8">
                {children}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 FILTER ITEM                                */
/* -------------------------------------------------------------------------- */

interface FilterItemProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

export function FilterItem({ label, children, className }: FilterItemProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                {label}
            </label>
            <div className="relative group">
                {children}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   INPUT                                    */
/* -------------------------------------------------------------------------- */

interface FilterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function FilterInput({ icon, className, ...props }: FilterInputProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    {icon}
                </div>
            )}
            <input
                className={cn(
                    "w-full h-16 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all text-base font-medium placeholder:text-gray-400 text-gray-900 border",
                    icon ? "pl-14 pr-4" : "px-5",
                    className
                )}
                {...props}
            />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   SELECT                                   */
/* -------------------------------------------------------------------------- */

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    icon?: React.ReactNode;
}

export function FilterSelect({ icon, className, children, ...props }: FilterSelectProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    {icon}
                </div>
            )}
            <select
                className={cn(
                    "w-full h-16 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all text-base font-medium text-gray-700 border appearance-none cursor-pointer",
                    icon ? "pl-14 pr-10" : "px-5 pr-10",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                   BUTTON                                   */
/* -------------------------------------------------------------------------- */

export function FilterButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "w-full h-16 bg-gray-900 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
