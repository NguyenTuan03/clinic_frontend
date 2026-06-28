"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/routes/MenuRoutes";

export default function SidebarMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1.5">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
