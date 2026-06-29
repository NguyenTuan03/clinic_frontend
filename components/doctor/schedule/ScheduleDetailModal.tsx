"use client";

import React from "react";
import { Schedule } from "@/types";
import { X, CalendarIcon, Clock, Trash2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    isBooked: boolean;
    resource: Schedule;
}

interface ScheduleDetailModalProps {
    isOpen: boolean;
    event: CalendarEvent | null;
    onClose: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export default function ScheduleDetailModal({
    isOpen,
    event,
    onClose,
    onDelete,
    isDeleting,
}: ScheduleDetailModalProps) {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
                <CardHeader className="relative pr-12 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-lg">Chi tiết khung giờ làm việc</CardTitle>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                    <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 text-sm">
                        <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                            <CalendarIcon className="w-4.5 h-4.5 text-emerald-600" />
                            <span><strong>Ngày khám:</strong> {event.resource.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                            <Clock className="w-4.5 h-4.5 text-emerald-600" />
                            <span><strong>Khung giờ:</strong> {event.resource.start_time} - {event.resource.end_time}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <strong className="text-zinc-700 dark:text-zinc-300">Trạng thái:</strong>
                            {event.isBooked ? (
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

                    {event.isBooked ? (
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
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                    {!event.isBooked && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDelete}
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
    );
}
