import type React from "react"
// @ts-ignore - allow importing css files without type declarations
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatDock } from "@/components/ai/chat-dock"
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "@/providers/GlobalProvider";


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hey Kerala",
  description: "Discover places, events, and stays in God's Own Country.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  generator: 'v0.app'
}

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <GlobalProvider>
            <Toaster position="top-right" />

            <ClientLayout>
              <main className="min-h-screen">
                {children}
              </main>
            </ClientLayout>

            <ChatDock />
            <Footer />
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
