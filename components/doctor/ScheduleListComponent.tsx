"use client";

import { useState } from "react";
import { AppointmentStatus, Schedule } from "@/types";
import { CardContent } from "../ui/card";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { AlertCircle, Loader2, List, Calendar as CalendarIconUI } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";

// Import react-big-calendar và localizer moment
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import moment from "moment";
import { momentLocalizer, Views, View } from "react-big-calendar";

import SchedulesAgendaList from "./SchedulesAgendaList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import useDoctorCalendar from "./hooks/useDoctorCalendar";
import useDeleteSchedule from "./hooks/useDeleteSchedule";

// Cấu hình ngôn ngữ tiếng Việt cho moment
import "moment/locale/vi";
moment.locale("vi");
const localizer = momentLocalizer(moment);

interface SchedulesResponse {
    success: boolean;
    message: string;
    data: Schedule[];
}

export default function ScheduleListComponent() {
    const { user: currentUser } = useAuth();
    const { appointments } = useApp();

    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState<Date>(new Date());
    const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");

    // Fetch danh sách lịch rảnh
    const { data: schedules = [], isLoading, isError, refetch } = useQuery<Schedule[]>({
        queryKey: ["schedules"],
        queryFn: async () => {
            const res = await http.get<SchedulesResponse>("/schedules");
            return res.data || [];
        },
    });

    // Lọc lịch của bác sĩ hiện tại (trả về [] khi chưa có user)
    const doctorSchedules = schedules.filter(s => s.user_id === Number(currentUser?.id));

    // Hàm kiểm tra xem slot có bị đặt chưa
    const checkIsBooked = (scheduleId: number) =>
        appointments.some(
            apt => Number(apt.scheduleId) === scheduleId && apt.status !== AppointmentStatus.CANCELLED
        );

    // Hook calendar: chuyển schedule → events, eventPropGetter, minTime, maxTime, messages, handleSelectEvent
    const {
        events,
        eventPropGetter,
        minTime,
        maxTime,
        handleSelectEvent,
        selectedEvent,
        setSelectedEvent,
        showDeleteModal,
        setShowDeleteModal,
        messages,
    } = useDoctorCalendar(doctorSchedules, checkIsBooked);

    // Hook xóa lịch rảnh
    const { isDeleting, deletingId, handleDeleteConfirm, handleDeleteListClick } = useDeleteSchedule(
        selectedEvent,
        setSelectedEvent,
        setShowDeleteModal,
        checkIsBooked,
    );

    // Early returns sau khi tất cả hooks đã được gọi
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

    return (
        <CardContent className="p-4 space-y-4">
            {/* Header controls: Tab switch & Legend */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                {/* Tab Switch buttons */}
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("calendar")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "calendar"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                    >
                        <CalendarIconUI className="w-4 h-4" />
                        <span>Xem dạng lịch</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("list")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "list"
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                    >
                        <List className="w-4 h-4" />
                        <span>Xem dạng danh sách</span>
                    </button>
                </div>

                {/* Color Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-emerald-600" />
                        <span>Lịch rảnh (Trống)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-md bg-sky-600" />
                        <span>Đã được đặt</span>
                    </span>
                </div>
            </div>

            {activeTab === "calendar" ? (
                /* 1. REACT BIG CALENDAR - CHỈ SHOW MONTH VÀ WEEK */
                <div className="h-[600px] border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 p-2 shadow-xs">
                    <ShadcnBigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={[Views.MONTH, Views.WEEK]}
                        view={view}
                        onView={(newView) => setView(newView)}
                        date={date}
                        onNavigate={(newDate) => setDate(newDate)}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                        min={minTime}
                        max={maxTime}
                        messages={messages}
                    />
                </div>
            ) : (
                /* 2. DANH SÁCH / AGENDA */
                <SchedulesAgendaList
                    doctorSchedules={doctorSchedules}
                    isDeleting={isDeleting}
                    deletingId={deletingId}
                    checkIsBooked={checkIsBooked}
                    onDeleteClick={handleDeleteListClick}
                />
            )}

            {/* Modal chi tiết & xóa lịch rảnh */}
            <ScheduleDetailModal
                isOpen={showDeleteModal}
                event={selectedEvent}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedEvent(null);
                }}
                onDelete={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </CardContent>
    );
}