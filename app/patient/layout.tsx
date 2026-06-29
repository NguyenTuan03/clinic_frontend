import React from "react";
import Link from "next/link";
import { HeartPulse } from "lucide-react";
import ButtonMenu from "@/components/layout/patient/ButtonMenu";
import UserProfileBriefComponent from "@/components/layout/patient/UserProfileBrief";
import MobileDrawerComponent from "@/components/layout/patient/MobileDrawer";
import SidebarMenu from "@/components/layout/patient/SidebarMenu";
import LogoutButton from "@/components/layout/patient/LogoutButton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cổng thông tin Bệnh nhân | Phòng khám Đa khoa Tâm An",
    description: "Cổng thông tin dành cho Bệnh nhân đặt lịch hẹn khám bệnh và theo dõi quá trình điều trị trực tuyến.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80 h-16 px-4 flex items-center justify-between sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white text-base">Tâm An Clinic</span>
                </Link>
                <ButtonMenu />
            </header>

            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800/80 shrink-0 sticky top-0 h-screen z-30">
                {/* Logo */}
                <div className="h-16 px-6 border-b border-zinc-50 dark:border-zinc-800/50 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                        <HeartPulse className="w-5.5 h-5.5" />
                    </div>
                    <div>
                        <span className="font-bold text-zinc-900 dark:text-white block text-sm leading-tight">Tâm An Clinic</span>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block -mt-0.5">Cổng Bệnh nhân</span>
                    </div>
                </div>

                {/* User profile brief */}
                <UserProfileBriefComponent />

                {/* Navigation links */}
                <SidebarMenu />

                {/* Footer actions inside Sidebar */}
                <div className="p-4 border-t border-zinc-50 dark:border-zinc-800/50">
                    <LogoutButton />
                </div>
            </aside>

            {/* Mobile Drawer (menu overlay) */}
            <MobileDrawerComponent />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
