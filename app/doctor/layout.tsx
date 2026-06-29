"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  Calendar as CalendarIcon,
  Sliders,
  LogOut,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { AppointmentStatus, UserRole } from "../../types";
import { useApp } from "../../context/AppContext";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { user: currentUser, logout } = useAuth();
  const { appointments } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Protection Check
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (currentUser.role !== UserRole.DOCTOR) {
      router.push("/patient");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== UserRole.DOCTOR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Trang này chỉ dành cho Bác sĩ.</p>
          <Button variant="primary" onClick={() => router.push("/login")}>Đi tới Đăng nhập</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const pendingCount = appointments.filter(
    a => a.schedule?.user?.id === Number(currentUser.id) && a.status === AppointmentStatus.PENDING
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Tâm An Clinic</span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block -mt-1">Hệ thống Bác sĩ</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-zinc-950 dark:text-white block">{currentUser.name}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 block">Bác sĩ chuyên khoa</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer active:scale-90"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid lg:grid-cols-12 gap-8">

        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 space-y-2 flex flex-col">
            <Link
              href="/doctor"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === "/doctor"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
            >
              <Activity className="w-5 h-5" />
              <span>Tổng quan</span>
            </Link>

            <Link
              href="/doctor/appointments"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === "/doctor/appointments"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Lịch hẹn bệnh nhân</span>
              {pendingCount > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>

            <Link
              href="/doctor/schedules"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${pathname === "/doctor/schedules"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
            >
              <Sliders className="w-5 h-5" />
              <span>Cấu hình lịch rảnh</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
