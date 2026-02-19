import type React from "react"
// @ts-ignore - allow importing css files without type declarations
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"




import { Providers } from "./providers";
import { AppShell } from "./AppShell";
import { Chatbot } from "@/components/ai/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hey Kerala",
  description: "Discover places, events, and stays in God's Own Country.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}
// Force rebuild: 1
