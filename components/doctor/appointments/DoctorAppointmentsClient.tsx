"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, AlertCircle } from "lucide-react";
import { AppointmentStatus, Appointment } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointmentsServer, updateAppointmentStatusServerAction } from "@/services/appointment";
import toast from "react-hot-toast";

import FilterStatus from "./FilterStatus";
import AppointmentCard from "./AppointmentCard";

export default function DoctorAppointmentsClient() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "ALL">("ALL");

    // Lấy danh sách lịch hẹn từ database backend qua react-query
    const { data: appointments = [], isLoading, isError, refetch } = useQuery<Appointment[]>({
        queryKey: ["appointments"],
        queryFn: getAppointmentsServer,
    });

    // Mutation cập nhật trạng thái lịch hẹn
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
            // Invalidate cả schedules để cập nhật trạng thái trống/đầy trên lịch
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (error) => {
            toast.error(error.message || "Không thể cập nhật trạng thái.");
        },
    });

    if (!currentUser) return null;

    if (isLoading) {
        return (
            <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-500">
                <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
                <span className="text-sm font-semibold">Đang tải danh sách cuộc hẹn...</span>
            </CardContent>
        );
    }

    if (isError) {
        return (
            <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-red-500">
                <AlertCircle className="w-11 h-11 text-red-500 animate-pulse" />
                <span className="text-sm font-semibold">Lỗi tải dữ liệu cuộc hẹn.</span>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 border border-red-200/50 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                    Tải lại danh sách
                </button>
            </CardContent>
        );
    }

    // Lọc lịch hẹn có bác sĩ là currentUser hiện tại
    const doctorAppointments = appointments.filter(
        (apt) => apt.schedule?.user?.id === Number(currentUser.id)
    );

    // Lọc theo bộ lọc trạng thái
    const filteredAppointments = doctorAppointments.filter((apt) => {
        if (filterStatus === "ALL") return true;
        return apt.status === filterStatus;
    });

    const handleConfirm = (id: number) => {
        updateMutation.mutate({ id, status: AppointmentStatus.CONFIRMED });
    };

    const handleCancel = (id: number) => {
        if (confirm("Bạn có chắc chắn muốn hủy cuộc hẹn này không?")) {
            updateMutation.mutate({ id, status: AppointmentStatus.CANCELLED });
        }
    };

    const handleOpenComplete = (id: number) => {
        if (confirm("Xác nhận hoàn thành việc khám cho bệnh nhân này?")) {
            updateMutation.mutate({ id, status: AppointmentStatus.DONE });
        }
    };

    return (
        <Card className="border-zinc-100 dark:border-zinc-800/50 animate-fadeIn">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>Danh sách cuộc hẹn bệnh nhân</span>
                </CardTitle>

                <FilterStatus value={filterStatus} onChange={setFilterStatus} />
            </CardHeader>

            <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-0">
                {filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                        Không tìm thấy cuộc hẹn nào.
                    </div>
                ) : (
                    filteredAppointments.map((apt) => (
                        <AppointmentCard
                            key={apt.id}
                            apt={apt}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                            onOpenComplete={handleOpenComplete}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
