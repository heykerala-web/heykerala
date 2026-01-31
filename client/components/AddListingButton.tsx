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
            <Button variant="outline" className="hidden lg:flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <PlusCircle className="h-4 w-4" />
                <span>List Property</span>
            </Button>
        </Link>
    );
}
