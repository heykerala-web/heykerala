"use client";

import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 hover:text-emerald-400 transition-colors">
                    <Globe className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl border-slate-100 p-1">
                <DropdownMenuItem className="rounded-lg font-medium cursor-pointer focus:bg-emerald-50 focus:text-emerald-600">
                    🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-medium cursor-pointer focus:bg-emerald-50 focus:text-emerald-600">
                    🇮🇳 Malayalam
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
