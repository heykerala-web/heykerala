"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${isScrolled
          ? "bg-white/80 backdrop-blur-xl border-white/20 shadow-sm py-0"
          : "bg-white/60 backdrop-blur-md border-transparent py-2"
          }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white text-xl">🌴</span>
            </div>
            <span className="font-outfit font-bold text-2xl tracking-tight text-foreground">
              Hey<span className="text-primary">Kerala</span>
            </span>
          </Link>

          {/* Search Bar - Desktop (Minimalist) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-12 relative z-50">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search destinations..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border-transparent bg-muted/50 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {/* Live Suggestions */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 pt-2 shadow-2xl">
                <SearchSuggestions
                  query={searchQuery}
                  onSelect={() => setSearchQuery("")}
                />
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium tracking-wide border-b-2 transition-all pb-1 ${pathname === "/" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}>
              HOME
            </Link>

            <div className="flex items-center gap-1 group">
              <Link href="/where-to-go" className={`text-sm font-medium tracking-wide border-b-2 transition-all pb-1 ${pathname.startsWith("/where-to-go") ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}>
                EXPLORE
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-3 rounded-2xl border-white/40 shadow-2xl backdrop-blur-xl bg-white/80" align="start">
                  {exploreCategories.map((c) => (
                    <DropdownMenuItem key={c.name} asChild>
                      <Link href={c.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                        <span className="text-xl">{c.icon}</span>
                        <span className="font-medium text-sm">{c.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`text-sm font-medium tracking-wide border-b-2 transition-all pb-1 ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}>
                  {link.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <AddListingButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="hidden md:flex items-center gap-2.5 px-4 h-10 rounded-full hover:bg-muted/50 transition-all">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/10">
                    {(!loading && user?.avatar) ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                    {!loading && user ? user.name : "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {!loading && user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    {user.role === "Admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-emerald-600 font-bold">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=overview">Dashboard</Link>
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
                      <Link href="/profile?tab=overview">Dashboard</Link>
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40 pb-safe">
        <div className="grid grid-cols-5 text-center text-[10px] font-bold">
          {[
            { href: "/", icon: "🏠", label: "Home" },
            { href: "/explore", icon: "🔍", label: "Explore" },
            { href: "/plan-trip", icon: "📋", label: "Plan" },
            { href: "/profile", icon: "👤", label: "Profile" },
            { href: "/emergency", icon: "🚨", label: "Emergency" },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 transition-all duration-300 ${active ? "text-emerald-600" : "text-gray-400 hover:text-gray-900"}`}
              >
                <span className={`text-xl mb-1 transition-transform ${active ? "scale-110" : ""}`}>{item.icon}</span>
                <span className="tracking-wide uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
