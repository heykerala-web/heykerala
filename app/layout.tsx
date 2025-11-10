import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatDock } from "@/components/ai/chat-dock"

const inter = Inter({ subsets: ["latin"] })

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
          <ChatDock />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
