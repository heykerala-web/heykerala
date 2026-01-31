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
    { href: "/saved", icon: <Heart size={18} />, label: "Saved" },
    { href: "/trips", icon: <Map size={18} />, label: "Trips" },
    { href: "/updates", icon: <Bell size={18} />, label: "Updates" },
    { href: "/inspiration", icon: <Sparkles size={18} />, label: "Inspiration" },
  ];

  return (
    <aside className="w-47 bg-white border-r h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="p-4">
          <h1 className="text-lg font-bold">Logo</h1>
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
          <button className="w-full mt-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition">
            New chat
          </button>
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div className="text-sm">
          <p className="font-semibold">Traveler</p>
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
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm
        ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}
      `}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
