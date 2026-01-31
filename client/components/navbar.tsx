"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import {
  Menu,
  Search,
  MessageSquare,
  User,
  MapPin,
  Heart,
  Calendar,
  Compass,
  Star,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSuggestions } from "@/components/ui/search-suggestions";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";
import { getAvatarUrl } from "@/lib/api";

/**
 * NOTE:
 * - This file merges the Navbar you provided with a left Sidebar (desktop).
 * - Sidebar is hidden on small screens (keeps your existing mobile Sheet menu).
 * - Replace/import any project-specific tokens/classes if needed (e.g., kerala-green).
 * - The uploaded screenshot is used as the small promo image in the Sidebar:
 *   "/mnt/data/WhatsApp Image 2025-11-25 at 11.56.24_25319a8a.jpg"
 */

/* --------------------- Data --------------------- */

const exploreCategories = [
  { name: "Attractions", href: "/where-to-go?tab=attractions", icon: "🏔️" },
  { name: "Art & Culture", href: "/where-to-go?tab=culture", icon: "🎨" },
  { name: "Picnic Spots", href: "/where-to-go?tab=picnic", icon: "🧺" },
  { name: "Regions", href: "/where-to-go?tab=regions", icon: "🗺️" },
  { name: "Spirituality", href: "/where-to-go?tab=spirituality", icon: "🛕" },
];

const navLinks = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/plan-trip", label: "Plan your trip", icon: Heart },
  { href: "/stay", label: "Stay", icon: Heart },
  { href: "/events", label: "Events", icon: Calendar },
];



import { AddListingButton } from "./AddListingButton";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  /* --------------------- Search Logic --------------------- */
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
      setSearchQuery(""); // Optional: clear after search
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌴</span>
            </div>
            <span className="font-bold text-xl">
              <span className="text-emerald-600">Hey</span> Kerala
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative z-50">
            <div className="relative w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 rounded-full border-gray-200 focus:border-emerald-600 focus:ring-emerald-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                Search
              </Button>
            </div>
            {/* Live Suggestions - Positioned below the input/button row */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 pt-2">
                <SearchSuggestions
                  query={searchQuery}
                  onSelect={() => setSearchQuery("")}
                />
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className={`font-medium ${pathname === "/" ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"}`}>
              Home
            </Link>

            <div className="flex items-center gap-1">
              <Link href="/where-to-go" className={`font-medium ${pathname.startsWith("/where-to-go") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"}`}>
                Where to go
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none p-1">
                  <ChevronDown className="h-4 w-4 text-gray-500 hover:text-emerald-600 transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-3" align="start">
                  {exploreCategories.map((c) => (
                    <DropdownMenuItem key={c.name} asChild>
                      <Link href={c.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                        <span className="text-lg">{c.icon}</span>
                        {c.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`font-medium ${active ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"}`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            <AddListingButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  {(!loading && user?.avatar) ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {!loading && user ? user.name : "Account"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {!loading && user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/emergency">Emergency</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                )}

                {!loading && !user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Create account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/emergency">Emergency</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button (keeps your sheet) */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {/* Mobile Search */}
                    <div className="relative z-50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSearch(searchQuery)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Search
                        </Button>
                      </div>

                      {searchQuery.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 pt-2">
                          <SearchSuggestions
                            query={searchQuery}
                            onSelect={() => setSearchQuery("")}
                          />
                        </div>
                      )}
                    </div>

                    {/* Mobile Navigation */}
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}

                    {/* Add Sidebar items to mobile sheet for parity */}
                    <div className="pt-2 border-t">
                      <Link href="/chats" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <MessageSquare className="h-5 w-5" />
                        Chats
                      </Link>
                      <Link href="/saved" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <Star className="h-5 w-5" />
                        Saved
                      </Link>
                      <Link href="/trips" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <MapPin className="h-5 w-5" />
                        Trips
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="grid grid-cols-5 text-center text-xs">
          {[
            { href: "/", icon: "🏠", label: "Home" },
            { href: "/explore", icon: "🔍", label: "Explore" },
            { href: "/plan-trip", icon: "📋", label: "Plan" },
            { href: "/profile", icon: "👤", label: "Profile" },
            { href: "/emergency", icon: "🚨", label: "Emergency" },
          ].map((item) => {
            const active = usePathname() === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col py-2 ${active ? "text-emerald-600" : "text-gray-500"}`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/* --------------------- App Layout Wrapper --------------------- */

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Main content area (navbar + page) */}
        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
