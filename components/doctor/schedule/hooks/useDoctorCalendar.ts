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

    // 1. Tập hợp ngày có lịch để highlight trên month view
    const scheduledDates = new Set(doctorSchedules.map(s => s.date));

    // 2. Chuyển đổi dữ liệu Schedule thành Event của Big Calendar
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
            title: isBooked ? "Đã có lịch hẹn" : "Giờ rảnh",
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

    // 3. Style event pill — clean, no gradient slop, dùng solid color
    const eventPropGetter = (event: CalendarEvent) => {
        if (event.isBooked) {
            return {
                style: {
                    background: "#0369a1",          // sky-700 — xanh dương trầm
                    borderLeft: "3px solid #075985", // sky-800
                    borderTop: "none",
                    borderRight: "none",
                    borderBottom: "none",
                    borderRadius: "6px",
                    color: "#f0f9ff",               // sky-50
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "0.01em",
                    padding: "3px 8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(3, 105, 161, 0.3)",
                },
            };
        }
        return {
            style: {
                background: "#065f46",             // emerald-800 — xanh lá trầm, clinical
                borderLeft: "3px solid #022c22",   // emerald-950
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                borderRadius: "6px",
                color: "#ecfdf5",                  // emerald-50
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.01em",
                padding: "3px 8px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(6, 95, 70, 0.3)",
            },
        };
    };

    // 4. Highlight ngày có lịch trên Month view — nền cực nhạt, không gây rối
    const dayPropGetter = (date: Date) => {
        const dateStr = date.toISOString().slice(0, 10);
        const hasSchedule = scheduledDates.has(dateStr);

        if (hasSchedule) {
            return {
                style: {
                    backgroundColor: "#f0fdf4",  // emerald-50 — gợi ý nhẹ không lấn át
                },
            };
        }
        return {};
    };

    // 5. Thời gian hiển thị 00:00 → 23:59
    const minTime = new Date();
    minTime.setHours(0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(23, 59, 0);

    // 6. Handler chọn event
    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    // 7. i18n tiếng Việt
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
        dayPropGetter,
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
