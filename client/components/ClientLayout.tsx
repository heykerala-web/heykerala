"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide global navbar ONLY on admin routes
    // Explore page relies on 100vh - 64px calculation, so it needs the navbar
    const hideNavbar = pathname?.startsWith("/admin");

    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
            {!hideNavbar && <ScrollToTop />}
        </>
    );
}
