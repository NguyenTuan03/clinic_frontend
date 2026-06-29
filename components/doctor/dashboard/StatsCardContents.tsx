"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment, AppointmentStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentsServer } from "@/services/appointment";

export default function StatsCards() {
    const { user: currentUser } = useAuth();

    // Đọc danh sách lịch hẹn từ React Query cache (được prefetch và hydrate từ server)
    const { data: appointments = [] } = useQuery<Appointment[]>({
        queryKey: ["appointments"],
        queryFn: getAppointmentsServer,
        enabled: !!currentUser,
    });

    if (!currentUser) return null;

    // Get current date string in YYYY-MM-DD
    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

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

    return (
        <div className="animate-fadeIn">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border-zinc-100 dark:border-zinc-800/50">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Chờ duyệt</span>
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
                    </CardContent>
                </Card>
                <Card className="border-zinc-100 dark:border-zinc-800/50">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Khám hôm nay</span>
                        <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.today}</span>
                    </CardContent>
                </Card>
                <Card className="border-zinc-100 dark:border-zinc-800/50">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Đã hủy</span>
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</span>
                    </CardContent>
                </Card>
                <Card className="border-zinc-100 dark:border-zinc-800/50">
                    <CardContent className="p-4 flex flex-col justify-center">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Tổng lịch hẹn</span>
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</span>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}