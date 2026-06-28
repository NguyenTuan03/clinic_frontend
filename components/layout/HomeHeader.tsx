"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { UserRole } from "@/types";

export default function HomeHeader() {
  const { user: currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg leading-tight tracking-tight block text-zinc-900 dark:text-white">
              Tâm An Clinic
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase block -mt-0.5">
              Chăm sóc tận tâm
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <a href="#about" className="hover:text-emerald-600 transition-colors">Về chúng tôi</a>
          <a href="#services" className="hover:text-emerald-600 transition-colors">Chuyên khoa</a>
          <a href="#doctors" className="hover:text-emerald-600 transition-colors">Đội ngũ bác sĩ</a>
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chào, <strong className="font-semibold text-zinc-900 dark:text-white">{currentUser.name}</strong>
              </span>
              <Link href={currentUser.role === UserRole.DOCTOR ? "/doctor" : "/patient"}>
                <Button variant="primary" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>Đăng xuất</Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="hidden sm:inline-flex">Đăng ký ngay</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
