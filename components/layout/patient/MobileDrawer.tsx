"use client";

import { useAuth } from "@/context/AuthContext";
import { menuItems } from "@/routes/MenuRoutes";
import { HeartPulse, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function MobileDrawerComponent() {
    const { user: currentUser, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    if (!currentUser) {
        return null;
    }
    return (
        <>
            {/* Mobile Drawer (menu overlay) */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    {/* Overlay background */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Drawer Content */}
                    <div className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-zinc-900 h-full shadow-xl z-50">
                        <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <HeartPulse className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-zinc-900 dark:text-white text-base">Tâm An Clinic</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile brief */}
                        <div className="p-4 mx-4 mt-6 mb-4 bg-slate-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block truncate">
                                    {currentUser.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
                                    {currentUser.email}
                                </span>
                            </div>
                        </div>

                        {/* Navigation links */}
                        <nav className="flex-1 px-4 space-y-1.5">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
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

                        {/* Footer actions inside Drawer */}
                        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}