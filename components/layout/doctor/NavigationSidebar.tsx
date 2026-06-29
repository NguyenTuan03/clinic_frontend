"use client";

import { getAppointmentsServer } from "@/services/appointment";
import { Activity, AlertCircle, CalendarIcon, Sliders } from "lucide-react";
import { AppointmentStatus, UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function NavigationSidebar() {
    const { user: currentUser } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Load appointments data from React Query (using the slot-hydrated cache)
    const { data: appointmentsData = [] } = useQuery<Appointment[]>({
        queryKey: ["appointments"],
        queryFn: getAppointmentsServer,
        enabled: !!currentUser,
    });

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


    const pendingCount = appointmentsData.filter(
        a => a.schedule?.user?.id === Number(currentUser.id) && a.status === AppointmentStatus.PENDING
    ).length;

    const navItems = [
        {
            href: "/doctor",
            label: "Tổng quan",
            icon: Activity,
        },
        {
            href: "/doctor/appointments",
            label: "Lịch hẹn bệnh nhân",
            icon: CalendarIcon,
            badge: pendingCount > 0 ? pendingCount : undefined,
        },
        {
            href: "/doctor/schedules",
            label: "Cấu hình lịch rảnh",
            icon: Sliders,
        },
    ];

    return (
        <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 space-y-2 flex flex-col">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            {item.badge !== undefined && (
                                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}