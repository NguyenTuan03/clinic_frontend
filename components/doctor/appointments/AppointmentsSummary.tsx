"use client";

import { AppointmentStatus, Appointment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointmentsServer, updateAppointmentStatusServerAction } from "@/services/appointment";
import { useAuth } from "@/context/AuthContext";
import { Calendar as CalendarIcon, Clock, User, Check, X, ArrowRight, Activity, Loader2 } from "lucide-react";
import { formatTime } from "@/helpers/formatTime";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AppointmentsSummary() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Fetch appointments from React Query cache / API
    const { data: appointments = [], isLoading, isError } = useQuery<Appointment[]>({
        queryKey: ["appointments"],
        queryFn: getAppointmentsServer,
        enabled: !!currentUser,
    });

    // Mutation to update appointment status
    const updateMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const res = await updateAppointmentStatusServerAction(id, status);
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Cập nhật trạng thái thành công!");
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (error) => {
            toast.error(error.message || "Thao tác thất bại.");
        },
    });

    if (!currentUser) return null;

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Đang tải cuộc hẹn...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] text-red-500 gap-1.5">
                <span className="text-xs font-semibold">Không thể tải danh sách cuộc hẹn</span>
            </div>
        );
    }

    // Filter doctor's appointments
    const doctorAppointments = appointments.filter(
        (apt) => apt.schedule?.user?.id === Number(currentUser.id)
    );

    // Group or sort (Pending first, then Confirmed, then Cancelled/Done, limited to 5)
    const sortedApts = [...doctorAppointments].sort((a, b) => {
        const priority = {
            [AppointmentStatus.PENDING]: 1,
            [AppointmentStatus.CONFIRMED]: 2,
            [AppointmentStatus.DONE]: 3,
            [AppointmentStatus.CANCELLED]: 4,
        };
        return (priority[a.status] || 99) - (priority[b.status] || 99);
    }).slice(0, 5);

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between h-[520px]">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        Cuộc hẹn gần đây ({doctorAppointments.length})
                    </span>
                </div>
                <Link
                    href="/doctor/appointments"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-0.5"
                >
                    Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-850 p-2 space-y-1">
                {sortedApts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs py-16">
                        Không có cuộc hẹn nào gần đây.
                    </div>
                ) : (
                    sortedApts.map((apt) => {
                        const start = formatTime(apt.schedule?.start_time);
                        const end = formatTime(apt.schedule?.end_time);
                        const timeSlot = `${start} - ${end}`;

                        return (
                            <div key={apt.id} className="p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 rounded-xl transition-all flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-zinc-400" />
                                            {apt.patient?.name || "Bệnh nhân"}
                                        </span>
                                        <Badge status={apt.status} className="scale-90 origin-left" />
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            {apt.schedule?.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {timeSlot}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {apt.status === AppointmentStatus.PENDING && (
                                        <>
                                            <button
                                                onClick={() => updateMutation.mutate({ id: apt.id, status: AppointmentStatus.CONFIRMED })}
                                                className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                                                title="Xác nhận"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Từ chối cuộc hẹn này?")) {
                                                        updateMutation.mutate({ id: apt.id, status: AppointmentStatus.CANCELLED });
                                                    }
                                                }}
                                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                                                title="Từ chối"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                    {apt.status === AppointmentStatus.CONFIRMED && (
                                        <button
                                            onClick={() => {
                                                if (confirm("Xác nhận đã khám xong cho bệnh nhân?")) {
                                                    updateMutation.mutate({ id: apt.id, status: AppointmentStatus.DONE });
                                                }
                                            }}
                                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 rounded-lg transition-colors flex items-center gap-0.5 text-xs font-bold cursor-pointer"
                                            title="Khám xong"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Khám xong
                                        </button>
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
