import type React from "react"
// @ts-ignore - allow importing css files without type declarations
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import BirdBackground from "@/components/BirdBackground"
import { Providers } from "./providers";
import { AppShell } from "./AppShell";
import { Toaster } from "@/components/ui/toaster";
import { OfflineBanner } from "@/components/OfflineBanner";
import { InstallPrompt } from "@/components/InstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Hey Kerala – Smart Tourism Guide",
  description: "AI-powered Kerala tourism guide. Discover places, events, and stays in God's Own Country.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HeyKerala",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OfflineBanner />
        <InstallPrompt />
        <div style={{ position: "relative", minHeight: "100vh" }}>
          <BirdBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Providers>
              <AppShell>{children}</AppShell>
              <Toaster />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
