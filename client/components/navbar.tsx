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
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSuggestions } from "@/components/ui/search-suggestions";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useState, useEffect } from "react";
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

/* --------------------- Data --------------------- */

const exploreCategories = [
  { name: "Attractions", href: "/where-to-go?tab=attractions", icon: "🏔️" },
  { name: "Art & Culture", href: "/where-to-go?tab=culture", icon: "🎨" },
  { name: "Picnic Spots", href: "/where-to-go?tab=picnic", icon: "🧺" },
  { name: "Regions", href: "/where-to-go?tab=regions", icon: "🗺️" },
  { name: "Spirituality", href: "/where-to-go?tab=spirituality", icon: "🛕" },
  { name: "Untold", href: "/where-to-go?tab=untold", icon: "✨" },
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out border-b ${isScrolled
          ? "bg-white/90 backdrop-blur-xl border-white/20 shadow-md py-2"
          : "bg-transparent border-transparent py-4"
          }`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary/90 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white text-xl">🌴</span>
            </div>
            <span className={`font-outfit font-bold text-2xl tracking-tight transition-colors duration-300 ${!isScrolled && pathname === '/' ? 'text-white drop-shadow-md' : 'text-foreground'}`}>
              Hey<span className="text-primary">Kerala</span>
            </span>
          </Link>

          {/* Search Bar - Desktop (Glassmorphic) */}
          <div className={`hidden md:flex flex-1 max-w-lg mx-12 relative z-50 transition-all duration-500 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0'}`}>
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search destinations, stays, events..."
                className={`w-full h-11 pl-11 pr-4 rounded-full border-transparent focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-sm ${isScrolled
                  ? 'bg-muted/50 focus:bg-white focus:border-primary/20'
                  : 'bg-white/90 backdrop-blur-md focus:bg-white border-white/40' // More distinct on hero
                  }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {/* Live Suggestions */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 pt-2">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <SearchSuggestions
                    query={searchQuery}
                    onSelect={() => setSearchQuery("")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`text-sm font-bold tracking-wide transition-all duration-300 relative group py-2 ${(!isScrolled && pathname === '/') ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-primary'}`}>
              HOME
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full ${pathname === "/" ? "w-full" : ""}`} />
            </Link>

            <div className="flex items-center gap-1 group relative">
              <Link href="/where-to-go" className={`text-sm font-bold tracking-wide transition-all duration-300 py-2 flex items-center gap-1 ${(!isScrolled && pathname === '/') ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-primary'}`}>
                WHERE TO GO
                <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                <div className="w-64 p-2 rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl bg-white/90">
                  {exploreCategories.map((c) => (
                    <Link key={c.name} href={c.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer group/item">
                      <span className="text-xl group-hover/item:scale-110 transition-transform">{c.icon}</span>
                      <span className="font-medium text-sm text-foreground group-hover/item:text-primary">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={`text-sm font-bold tracking-wide transition-all duration-300 relative group py-2 ${active ? "text-primary" : ((!isScrolled && pathname === '/') ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-primary')}`}>
                  {link.label.toUpperCase()}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full ${active ? "w-full" : ""}`} />
                </Link>
              );
            })}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 ml-6">
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <AddListingButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className={`hidden md:flex items-center gap-2.5 px-3 h-10 rounded-full transition-all border ${(!isScrolled && pathname === '/')
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md'
                  : 'hover:bg-muted/50 border-transparent'
                  }`}>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-sm">
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
                      <User className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${(!isScrolled && pathname === '/') ? 'text-white' : 'text-foreground'}`}>
                    {!loading && user ? user.name.split(' ')[0] : "Account"}
                  </span>
                  <ChevronDown className={`h-3 w-3 ${(!isScrolled && pathname === '/') ? 'text-white/70' : 'text-muted-foreground'}`} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-xl border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl p-2">
                {!loading && user && (
                  <>
                    <div className="px-2 py-2 mb-1 bg-muted/30 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${user.role === "Admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "Contributor" ? "bg-emerald-100 text-emerald-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="rounded-lg cursor-pointer">My Profile</Link>
                    </DropdownMenuItem>
                    {user.role === "Admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-emerald-600 font-bold rounded-lg cursor-pointer bg-emerald-50/50">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=overview" className="rounded-lg cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="flex items-center gap-2 rounded-lg cursor-pointer">
                        <HelpCircle className="h-4 w-4" /> Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium rounded-lg"
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                )}

                {!loading && !user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="font-bold cursor-pointer rounded-lg">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer rounded-lg">Create account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button (keeps your sheet) */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className={(!isScrolled && pathname === '/') ? 'text-white hover:bg-white/10' : ''}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80 border-l border-white/20 bg-white/95 backdrop-blur-xl p-0">
                  <SheetHeader className="p-6 border-b border-border/40">
                    <SheetTitle className="text-left font-outfit text-2xl font-bold text-primary">HeyKerala</SheetTitle>
                  </SheetHeader>

                  <div className="p-6 space-y-6">
                    {/* Mobile Search */}
                    <div className="relative z-50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search..."
                            className="pl-10 h-10 bg-muted/50 border-transparent rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link href={link.href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium">
                            <link.icon className="h-5 w-5 text-muted-foreground" />
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    {/* Add Sidebar items to mobile sheet for parity */}
                    <div className="pt-6 border-t border-border/40 space-y-1">
                      <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">My Account</p>
                      <Link href="/chats" className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        Chats
                      </Link>
                      <Link href="/saved" className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        Saved
                      </Link>
                      <Link href="/trips" className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="grid grid-cols-5 text-center px-2">
          {[
            { href: "/", icon: "🏠", label: "Home" },
            { href: "/explore", icon: "🔍", label: "Explore" },
            { href: "/plan-trip", icon: "📋", label: "Plan" },
            { href: "/profile", icon: "👤", label: "Profile" },
            { href: "/emergency", icon: "🚨", label: "Help" },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 relative group transition-all duration-300 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_2px_8px_rgba(var(--primary),0.5)]" />
                )}
                <span className={`text-xl mb-1 transition-transform duration-300 ${active ? "scale-110 -translate-y-1" : "group-hover:scale-110"}`}>{item.icon}</span>
                <span className={`text-[9px] font-bold tracking-widest uppercase transition-opacity ${active ? "opacity-100" : "opacity-70"}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

