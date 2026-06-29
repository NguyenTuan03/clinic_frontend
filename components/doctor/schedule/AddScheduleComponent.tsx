"use client";

import { AlertCircle, Plus } from "lucide-react";
import { CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { getTodayString } from "@/helpers/getTodayString";
import { createScheduleServerAction } from "@/services/schedule";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatTime } from "@/helpers/formatTime";

export default function AddScheduleComponent({ onSuccess }: { onSuccess?: () => void }) {
    const { schedules } = useApp();
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const todayStr = getTodayString();

    // Form states for adding schedule
    const [scheduleDate, setScheduleDate] = useState(todayStr);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("09:00");
    const [scheduleError, setScheduleError] = useState("");
    const [isPending, setIsPending] = useState(false);

    // Filter schedules for this doctor
    const doctorSchedules = currentUser 
        ? schedules.filter(s => s.user_id === Number(currentUser.id)) 
        : [];

    const handleAddScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduleDate || !startTime || !endTime) {
            setScheduleError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
        const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

        if (startMinutes >= endMinutes) {
            setScheduleError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
            return;
        }

        const selectedDate = new Date(scheduleDate);
        const today = new Date(todayStr);
        if (selectedDate < today) {
            setScheduleError("Không thể tạo lịch rảnh cho ngày trong quá khứ");
            return;
        }

        // Check duplicate schedule slot
        const isDuplicate = doctorSchedules.some(
            s => s.date === scheduleDate && formatTime(s.start_time) === startTime && formatTime(s.end_time) === endTime
        );

        if (isDuplicate) {
            setScheduleError("Khung giờ này đã được thiết lập trước đó");
            return;
        }

        setScheduleError("");
        setIsPending(true);

        try {
            // Gọi Server Action để thực hiện tạo ở Server-side
            const res = await createScheduleServerAction({
                date: scheduleDate,
                start_time: startTime,
                end_time: endTime,
            });

            if (res.success) {
                toast.success(res.message);
                // Invalidate query để React Query cập nhật cache client-side
                queryClient.invalidateQueries({ queryKey: ["schedules"] });
                onSuccess?.();
            } else {
                setScheduleError(res.message);
            }
        } catch {
            setScheduleError("Đã xảy ra lỗi khi tạo lịch rảnh.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <CardContent>
            {scheduleError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{scheduleError}</span>
                </div>
            )}

            <form onSubmit={handleAddScheduleSubmit} className="space-y-4">
                <Input
                    label="Chọn ngày rảnh"
                    type="date"
                    value={scheduleDate}
                    min={todayStr}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Giờ bắt đầu"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />

                    <Input
                        label="Giờ kết thúc"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full mt-2 flex items-center gap-1 justify-center"
                    disabled={isPending}
                >
                    <Plus className="w-4 h-4" />
                    {isPending ? "Đang xử lý..." : "Thêm khung giờ rảnh"}
                </Button>
            </form>
        </CardContent>
    );
}