"use client";

import { useAuth } from "@/context/AuthContext";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AddListingButton() {
    const { user } = useAuth();

    // Only show if logged in (or maybe show and redirect to login)
    if (!user) return null;

    return (
        <Link href="/add-listing">
            <Button size="sm" variant="outline" className="hidden lg:flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5 rounded-full font-bold px-5">
                <PlusCircle className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest">List Property</span>
            </Button>
        </Link>
    );
}
