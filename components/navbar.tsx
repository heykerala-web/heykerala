"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, MessageSquare, User, MapPin, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const exploreCategories = [
  { name: "Attractions", href: "/where-to-go?tab=attractions", icon: "🏔️", color: "bg-emerald-50 text-emerald-700" },
  { name: "Art & Culture", href: "/where-to-go?tab=culture", icon: "🎨", color: "bg-purple-50 text-purple-700" },
  { name: "Picnic Spots", href: "/where-to-go?tab=picnic", icon: "🧺", color: "bg-orange-50 text-orange-700" },
  { name: "Regions", href: "/where-to-go?tab=regions", icon: "🗺️", color: "bg-blue-50 text-blue-700" },
  { name: "Spirituality", href: "/where-to-go?tab=spirituality", icon: "🛕", color: "bg-yellow-50 text-yellow-700" },
]

const navLinks = [
  { href: "/where-to-go", label: "Where to go", icon: MapPin },
  { href: "/experiences", label: "Experiences", icon: Calendar },
  { href: "/plan-trip", label: "Plan your trip", icon: Heart },
  { href: "/hotels", label: "Stay", icon: Heart },
  { href: "/events", label: "Events", icon: Calendar },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-kerala-green rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌴</span>
            </div>
            <span className="font-poppins font-bold text-xl">
              <span className="kerala-green">Hey</span> Kerala
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations, hotels, events..."
                className="pl-10 h-10 rounded-full border-gray-200 focus:border-kerala-green"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-kerala-green transition-colors">
                Where to go
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {exploreCategories.map((category) => (
                    <DropdownMenuItem key={category.name} asChild>
                      <Link href={category.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                        <div
                          className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-lg`}
                        >
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1, 4).map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-kerala-green" : "text-gray-700 hover:text-kerala-green"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="hidden md:flex text-sea-blue">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Guide
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Sign up</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/emergency">Emergency</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search..." className="pl-10" />
                    </div>
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <link.icon className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/where-to-go", label: "Explore", icon: "🔍" },
            { href: "/plan-trip", label: "Plan", icon: "📋" },
            { href: "/profile", label: "Profile", icon: "👤" },
            { href: "/emergency", label: "Emergency", icon: "🚨" },
          ].map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-kerala-green" : "text-gray-500"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
