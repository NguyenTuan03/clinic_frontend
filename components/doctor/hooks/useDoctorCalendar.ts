"use client";

import { useState } from "react";
import { Schedule, CalendarEvent } from "@/types";
import { parseTime } from "@/helpers/formatTime";

export default function useDoctorCalendar(
    doctorSchedules: Schedule[], 
    checkIsBooked: (scheduleId: number) => boolean
) {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 1. Chuyển đổi dữ liệu Schedule thành Event của Big Calendar
    const events: CalendarEvent[] = doctorSchedules.map((sch) => {
        const isBooked = checkIsBooked(sch.id);
        const startTimeParsed = parseTime(sch.start_time);
        const endTimeParsed = parseTime(sch.end_time);

        const startDate = new Date(sch.date);
        startDate.setHours(startTimeParsed.hours, startTimeParsed.minutes, 0);

        const endDate = new Date(sch.date);
        endDate.setHours(endTimeParsed.hours, endTimeParsed.minutes, 0);

        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedStart = `${pad(startTimeParsed.hours)}:${pad(startTimeParsed.minutes)}`;
        const formattedEnd = `${pad(endTimeParsed.hours)}:${pad(endTimeParsed.minutes)}`;

        return {
            id: sch.id,
            title: isBooked ? `Đã đặt khám` : `Giờ rảnh`,
            start: startDate,
            end: endDate,
            isBooked,
            resource: {
                ...sch,
                start_time: formattedStart,
                end_time: formattedEnd,
            },
        };
    });

    // 2. Custom css class cho các event
    const eventPropGetter = (event: CalendarEvent) => {
        const baseClass = "px-2 py-1 text-xs font-semibold rounded-lg shadow-sm border-0 cursor-pointer text-white flex flex-col justify-center min-h-[36px] transition-all hover:brightness-95";
        const customColorClass = event.isBooked
            ? "bg-sky-600/90 dark:bg-sky-700/90 shadow-sky-600/10"
            : "bg-emerald-600/90 dark:bg-emerald-700/90 shadow-emerald-600/10";
        return {
            className: `${baseClass} ${customColorClass}`,
        };
    };

    // 3. Thiết lập thời gian hiển thị từ 00:00 sáng đến 23:59 tối
    const minTime = new Date();
    minTime.setHours(0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(23, 59, 0);

    // 4. Click event handler
    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    // 5. Ngôn ngữ tiếng Việt cho Lịch
    const messages = {
        today: "Hôm nay",
        previous: "Trước",
        next: "Sau",
        month: "Tháng",
        week: "Tuần",
        day: "Ngày",
        agenda: "Lịch trình",
    };

    return {
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
    };
}
