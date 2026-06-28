"use client";

import { useApp } from "@/context/AppContext";
import { Menu, X } from "lucide-react";


export default function ButtonMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useApp();

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </>
  );
}