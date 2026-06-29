"use client";

import { useQuery } from "@tanstack/react-query";
import { getSchedulesServer } from "@/services/schedule";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { AppointmentStatus, Schedule } from "@/types";
import { CalendarRange, Clock, ArrowRight, Loader2, Calendar } from "lucide-react";
import { formatTime } from "@/helpers/formatTime";
import Link from "next/link";

export default function SchedulesSummary() {
    const { user: currentUser } = useAuth();
    const { appointments } = useApp();

    // Fetch schedules from React Query cache / API
    const { data: schedules = [], isLoading, isError } = useQuery<Schedule[]>({
        queryKey: ["schedules"],
        queryFn: getSchedulesServer,
        enabled: !!currentUser,
    });

    if (!currentUser) return null;

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Đang tải lịch làm việc...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] text-red-500 gap-1.5">
                <span className="text-xs font-semibold">Không thể tải danh sách lịch biểu</span>
            </div>
        );
    }

    // Filter doctor's schedules
    const doctorSchedules = schedules.filter((s) => s.user_id === Number(currentUser.id));

    // Helper to check if a schedule has been booked
    const checkIsBooked = (scheduleId: number) => {
        return appointments.some(
            (apt) => Number(apt.schedule_id) === scheduleId && apt.status !== AppointmentStatus.CANCELLED
        );
    };

    // Sort schedules (by date, then start_time) and take the next 5
    const upcomingSchedules = [...doctorSchedules]
        .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.start_time.localeCompare(b.start_time);
        })
        .slice(0, 5);

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between h-[520px]">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarRange className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        Khung giờ đã cấu hình ({doctorSchedules.length})
                    </span>
                </div>
                <Link
                    href="/doctor/schedules"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-0.5"
                >
                    Cấu hình lịch <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-850 p-2 space-y-1">
                {upcomingSchedules.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs py-16">
                        Chưa cấu hình lịch biểu trống nào.
                    </div>
                ) : (
                    upcomingSchedules.map((sch) => {
                        const isBooked = checkIsBooked(sch.id);
                        const start = formatTime(sch.start_time);
                        const end = formatTime(sch.end_time);

                        return (
                            <div key={sch.id} className="p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 rounded-xl transition-all flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                        <span>Ngày {sch.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{start} - {end}</span>
                                    </div>
                                </div>

                                {/* Status Pill Badge */}
                                <div className="shrink-0">
                                    {isBooked ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-sky-200/60 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20">
                                            Đã được đặt
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                            Khung giờ trống
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
