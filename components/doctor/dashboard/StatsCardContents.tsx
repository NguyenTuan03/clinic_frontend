"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment, AppointmentStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsServer } from "@/services/appointment";
import { getTodayString } from "@/helpers/getTodayString";

export default function StatsCards() {
    const { user: currentUser } = useAuth();

    // Đọc danh sách lịch hẹn từ React Query cache (được prefetch và hydrate từ server)
    const { data: appointments = [] } = useQuery<Appointment[]>({
        queryKey: ["appointments"],
        queryFn: getAppointmentsServer,
        enabled: !!currentUser,
    });

    if (!currentUser) return null;

    const todayStr = getTodayString();

    // Filter appointments for this doctor (checking schedule user id)
    const doctorAppointments = appointments.filter(
        (apt) => apt.schedule?.user?.id === Number(currentUser.id)
    );

    // Filter appointments for Today
    const todayAppointments = doctorAppointments.filter((apt) => apt.schedule?.date === todayStr);

    // Calculate statistics
    const stats = {
        total: doctorAppointments.length,
        pending: doctorAppointments.filter((a) => a.status === AppointmentStatus.PENDING).length,
        today: todayAppointments.filter((a) => a.status === AppointmentStatus.CONFIRMED).length,
        cancelled: doctorAppointments.filter((a) => a.status === AppointmentStatus.CANCELLED).length,
    };

    const statItems = [
        {
            title: "Chờ duyệt",
            value: stats.pending,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-955/20",
            borderColor: "border-amber-200/50",
        },
        {
            title: "Khám hôm nay",
            value: stats.today,
            color: "text-sky-600 dark:text-sky-400",
            bgColor: "bg-sky-50 dark:bg-sky-955/20",
            borderColor: "border-sky-200/50",
        },
        {
            title: "Đã hủy",
            value: stats.cancelled,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-50 dark:bg-red-955/20",
            borderColor: "border-red-200/50",
        },
        {
            title: "Tổng lịch hẹn",
            value: stats.total,
            color: "text-zinc-900 dark:text-white",
            bgColor: "bg-zinc-50 dark:bg-zinc-955/20",
            borderColor: "border-zinc-200/50",
        },
    ]

    return (
        <div className="animate-fadeIn">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {
                    statItems.map((item, idx) => {
                        return (
                            <Card key={idx} className={`${item.bgColor} ${item.borderColor} ${item.color} transition-all duration-300 hover:scale-105`}>
                                <CardContent className="p-4 flex flex-col justify-center">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">{item.title}</span>
                                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{item.value}</span>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    );
}