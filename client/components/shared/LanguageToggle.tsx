"use client";

import { Globe, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 hover:text-emerald-400 transition-colors">
                    <Globe className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl border-slate-100 p-1">
                <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className={cn(
                        "rounded-lg font-medium cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 flex items-center justify-between",
                        language === "en" && "bg-emerald-50 text-emerald-600"
                    )}
                >
                    🇺🇸 English
                    {language === "en" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("ml")}
                    className={cn(
                        "rounded-lg font-medium cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 flex items-center justify-between",
                        language === "ml" && "bg-emerald-50 text-emerald-600"
                    )}
                >
                    🇮🇳 Malayalam
                    {language === "ml" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
