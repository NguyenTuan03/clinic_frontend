"use client";

import React from "react";
import { Schedule } from "@/types";
import { CalendarIcon, Clock, Trash2, Loader2 } from "lucide-react";
import { parseTime } from "@/helpers/formatTime";

interface SchedulesAgendaListProps {
    doctorSchedules: Schedule[];
    isDeleting: boolean;
    deletingId: number | null;
    checkIsBooked: (id: number) => boolean;
    onDeleteClick: (sch: Schedule) => void;
}

export default function SchedulesAgendaList({
    doctorSchedules,
    isDeleting,
    deletingId,
    checkIsBooked,
    onDeleteClick,
}: SchedulesAgendaListProps) {
    return (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {doctorSchedules.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                    Không tìm thấy lịch rảnh nào. Hãy bấm &quot;Thêm khung giờ rảnh&quot; để thiết lập.
                </div>
            ) : (
                [...doctorSchedules]
                    .sort((a, b) => {
                        if (a.date !== b.date) return a.date.localeCompare(b.date);
                        return a.start_time.localeCompare(b.start_time);
                    })
                    .map((sch) => {
                        const isBooked = checkIsBooked(sch.id);
                        const isCurrentDeleting = isDeleting && deletingId === sch.id;

                        const startTimeParsed = parseTime(sch.start_time);
                        const endTimeParsed = parseTime(sch.end_time);
                        const pad = (n: number) => n.toString().padStart(2, "0");
                        const formattedStart = `${pad(startTimeParsed.hours)}:${pad(startTimeParsed.minutes)}`;
                        const formattedEnd = `${pad(endTimeParsed.hours)}:${pad(endTimeParsed.minutes)}`;

                        return (
                            <div
                                key={sch.id}
                                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${isBooked
                                    ? "bg-sky-50/30 border-sky-100 dark:bg-sky-950/5 dark:border-sky-950/20"
                                    : "bg-white border-zinc-100 hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                        <CalendarIcon className="w-4 h-4 text-zinc-400" />
                                        {sch.date}
                                    </span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                        {formattedStart} - {formattedEnd}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {isBooked ? (
                                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-500/20">
                                            Đã được đặt
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                                Còn trống
                                            </span>
                                            <button
                                                onClick={() => onDeleteClick(sch)}
                                                disabled={isDeleting}
                                                className="p-1.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                                                title="Xóa lịch rảnh"
                                            >
                                                {isCurrentDeleting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
            )}
        </div>
    );
}
