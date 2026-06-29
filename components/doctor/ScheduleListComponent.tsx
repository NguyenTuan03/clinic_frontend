"use client";

import { useState } from "react";
import { AppointmentStatus, Schedule } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { AlertCircle, CalendarIcon, Clock, Trash2, Loader2, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteScheduleServerAction } from "@/services/schedule";
import http from "@/utils/http";
import toast from "react-hot-toast";

// Import react-big-calendar và localizer moment
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import moment from "moment";
import { momentLocalizer, Views, View } from "react-big-calendar";
import { Button } from "../ui/button";

// Cấu hình ngôn ngữ tiếng Việt cho moment
import "moment/locale/vi";
moment.locale("vi");
const localizer = momentLocalizer(moment);

interface SchedulesResponse {
    success: boolean;
    message: string;
    data: Schedule[];
}

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    isBooked: boolean;
    resource: Schedule;
}

export default function ScheduleListComponent() {
    const { user: currentUser } = useAuth();
    const { appointments } = useApp();
    const queryClient = useQueryClient();

    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState<Date>(new Date());

    // useQuery sẽ đọc cache được prefetch (mảng Schedule[]) từ Server Component gửi xuống
    const { data: schedules = [], isLoading, isError, refetch } = useQuery<Schedule[]>({
        queryKey: ["schedules"],
        queryFn: async () => {
            const res = await http.get<SchedulesResponse>("/schedules");
            return res.data || [];
        },
    });

    if (!currentUser) return null;

    if (isLoading) {
        return (
            <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-500">
                <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
                <span className="text-sm font-semibold">Đang tải lịch làm việc...</span>
            </CardContent>
        );
    }

    if (isError) {
        return (
            <CardContent className="py-16 flex flex-col items-center justify-center gap-3 text-red-500">
                <AlertCircle className="w-11 h-11 text-red-500 animate-pulse" />
                <span className="text-sm font-semibold">Lỗi tải dữ liệu lịch rảnh.</span>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 border border-red-200/50 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                    Tải lại danh sách
                </button>
            </CardContent>
        );
    }

    // Filter schedules for this doctor
    const doctorSchedules = schedules.filter(s => s.user_id === Number(currentUser.id));

    const checkIsBooked = (scheduleId: number) => {
        return appointments.some(
            apt => Number(apt.scheduleId) === scheduleId && apt.status !== AppointmentStatus.CANCELLED
        );
    };

    // Chuyển đổi dữ liệu Schedule thành Event của Big Calendar
    const events: CalendarEvent[] = doctorSchedules.map((sch) => {
        const isBooked = checkIsBooked(sch.id);
        const [startHours, startMins] = sch.start_time.split(":");
        const [endHours, endMins] = sch.end_time.split(":");
        
        const startDate = new Date(sch.date);
        startDate.setHours(parseInt(startHours), parseInt(startMins), 0);

        const endDate = new Date(sch.date);
        endDate.setHours(parseInt(endHours), parseInt(endMins), 0);

        return {
            id: sch.id,
            title: isBooked ? `Đã đặt khám` : `Giờ rảnh`,
            start: startDate,
            end: endDate,
            isBooked,
            resource: sch,
        };
    });

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return;
        setIsDeleting(true);

        try {
            const res = await deleteScheduleServerAction(String(selectedEvent.id));
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
        }
    };

    // Custom css class cho các event
    const eventPropGetter = (event: CalendarEvent) => {
        const baseClass = "px-2 py-1 text-xs font-semibold rounded-lg shadow-sm border-0 cursor-pointer text-white flex flex-col justify-center min-h-[36px] transition-all hover:brightness-95";
        const customColorClass = event.isBooked
            ? "bg-sky-600/90 dark:bg-sky-700/90 shadow-sky-600/10"
            : "bg-emerald-600/90 dark:bg-emerald-700/90 shadow-emerald-600/10";
        return {
            className: `${baseClass} ${customColorClass}`,
        };
    };

    return (
        <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-4 text-xs font-semibold justify-end pb-2">
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-md bg-emerald-600" />
                    <span>Lịch rảnh (Còn trống)</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-md bg-sky-600" />
                    <span>Đã có bệnh nhân đặt</span>
                </span>
            </div>

            {/* Container render React Big Calendar */}
            <div className="h-[600px] border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 p-2 shadow-xs">
                <ShadcnBigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    view={view}
                    onView={(newView) => setView(newView)}
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventPropGetter}
                    messages={{
                        today: "Hôm nay",
                        previous: "Trước",
                        next: "Sau",
                        month: "Tháng",
                        week: "Tuần",
                        day: "Ngày",
                        agenda: "Lịch trình",
                    }}
                />
            </div>

            {/* Event Details & Delete Confirmation Modal */}
            {showDeleteModal && selectedEvent && (
                <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                    <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
                        <CardHeader className="relative pr-12 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                            <CardTitle className="text-lg">Chi tiết khung giờ làm việc</CardTitle>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedEvent(null);
                                }}
                                className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="py-4 space-y-4">
                            <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 text-sm">
                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <CalendarIcon className="w-4.5 h-4.5 text-emerald-600" />
                                    <span><strong>Ngày khám:</strong> {selectedEvent.resource.date}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Clock className="w-4.5 h-4.5 text-emerald-600" />
                                    <span><strong>Khung giờ:</strong> {selectedEvent.resource.start_time} - {selectedEvent.resource.end_time}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <strong className="text-zinc-700 dark:text-zinc-300">Trạng thái:</strong>
                                    {selectedEvent.isBooked ? (
                                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-500/20">
                                            Đã có bệnh nhân đặt hẹn
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                            Còn trống (Có thể đặt)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {selectedEvent.isBooked ? (
                                <div className="p-3.5 bg-sky-50/50 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/20 text-sky-700 dark:text-sky-400 rounded-xl text-xs font-semibold leading-relaxed">
                                    Không thể xóa khung giờ này vì đã có bệnh nhân đăng ký đặt lịch khám.
                                </div>
                            ) : (
                                <div className="p-3.5 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-semibold leading-relaxed">
                                    Hành động này sẽ xóa vĩnh viễn khung giờ rảnh này của bạn. Bệnh nhân sẽ không thể thấy và đăng ký khám vào giờ này nữa.
                                </div>
                            )}
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedEvent(null);
                                }}
                            >
                                Đóng
                            </Button>
                            {!selectedEvent.isBooked && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200/50 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 dark:border-red-900/30 flex items-center gap-1 font-semibold"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>Xóa lịch rảnh</span>
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </CardContent>
    );
}