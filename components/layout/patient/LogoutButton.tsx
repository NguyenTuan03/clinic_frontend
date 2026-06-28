"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer border-0 bg-transparent font-sans"
    >
      <LogOut className="w-5 h-5" />
      <span>Đăng xuất</span>
    </button>
  );
}
