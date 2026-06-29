"use client";

import { useState } from "react";
import { Schedule, CalendarEvent } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { deleteScheduleServerAction } from "@/services/schedule";
import toast from "react-hot-toast";

export default function useDeleteSchedule(
    selectedEvent: CalendarEvent | null,
    setSelectedEvent: (e: CalendarEvent | null) => void,
    setShowDeleteModal: (v: boolean) => void,
    checkIsBooked: (id: number) => boolean
) {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteConfirm = async (id?: number) => {
        const targetId = id ?? selectedEvent?.id;
        if (!targetId) return;

        setIsDeleting(true);
        setDeletingId(targetId);

        try {
            const res = await deleteScheduleServerAction(String(targetId));
            if (res.success) {
                toast.success(res.message);
                queryClient.invalidateQueries({ queryKey: ["schedules"] });
                setShowDeleteModal(false);
                setSelectedEvent(null);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Đã xảy ra lỗi khi xóa lịch rảnh.");
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    const handleDeleteListClick = (sch: Schedule) => {
        if (checkIsBooked(sch.id)) {
            toast.error("Không thể xóa khung giờ này vì đã có bệnh nhân đặt hẹn khám.");
            return;
        }

        if (confirm(`Bạn có chắc chắn muốn xóa lịch rảnh ngày ${sch.date} (${sch.start_time} - ${sch.end_time}) không?`)) {
            handleDeleteConfirm(sch.id);
        }
    };

    return {
        isDeleting,
        deletingId,
        handleDeleteConfirm,
        handleDeleteListClick,
    };
}
