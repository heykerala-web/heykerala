"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { ChatDock } from "@/components/ai/chat-dock";
import ClientLayout from "@/components/ClientLayout";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith("/admin");

    return (
        <>
            <ClientLayout>
                <main className={`min-h-screen ${!isAdminPath && pathname !== '/' ? 'pt-24' : ''}`}>
                    {children}
                </main>
            </ClientLayout>

            {!isAdminPath && (
                <>
                    <ChatDock />
                    <Footer />
                </>
            )}
        </>
    );
}
