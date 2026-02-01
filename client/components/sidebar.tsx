"use client";

import React from "react";
import {
  MessageSquare,
  Compass,
  Heart,
  Map,
  Bell,
  Sparkles,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const navigation = [
    { href: "/", icon: <MessageSquare size={18} />, label: "Home" },
    { href: "/explore", icon: <Compass size={18} />, label: "Explore" },
    { href: "/profile?tab=saved", icon: <Heart size={18} />, label: "Saved" },
    { href: "/profile?tab=bookings", icon: <Map size={18} />, label: "Trips" },
    { href: "/updates", icon: <Bell size={18} />, label: "Updates" },
    { href: "/inspiration", icon: <Sparkles size={18} />, label: "Inspiration" },
  ];

  return (
    <aside className="w-47 bg-white border-r h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-6">
          <h1 className="font-outfit font-bold text-2xl tracking-tight text-foreground">
            Hey<span className="text-primary">Kerala</span>
          </h1>
        </div>

        <nav className="px-2">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              <SidebarItem icon={item.icon} label={item.label} />
            </a>
          ))}

          {/* Create */}
          <div className="mt-4">
            <SidebarItem icon={<Plus size={18} />} label="Create" />
          </div>

          {/* New Chat Button */}
          <button className="w-full mt-6 py-2.5 px-4 rounded-xl bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 border border-primary/10 font-outfit uppercase tracking-wider">
            New session
          </button>
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-6 border-t border-border flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
          <span className="text-primary font-bold">BK</span>
        </div>
        <div className="text-sm">
          <p className="font-outfit font-bold text-foreground">Traveler</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium Member</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-300 font-inter font-medium
        ${active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
      `}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
