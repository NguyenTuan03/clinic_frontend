import { Appointment, AppointmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    FileText,
} from "lucide-react";
import { formatTime } from "@/helpers/formatTime";

interface AppointmentCardProps {
    apt: Appointment;
    onConfirm: (id: number) => void;
    onCancel: (id: number) => void;
    onOpenComplete: (id: number) => void;
}

export default function AppointmentCard({
    apt,
    onConfirm,
    onCancel,
    onOpenComplete,
}: AppointmentCardProps) {
    const formattedStartTime = formatTime(apt.schedule?.start_time);
    const formattedEndTime = formatTime(apt.schedule?.end_time);
    const timeSlot = `${formattedStartTime} - ${formattedEndTime}`;

    return (
        <div className="p-6 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Patient Info */}
            <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-base">
                        <User className="w-4.5 h-4.5 text-zinc-400" />
                        {apt.patient?.name || "Bệnh nhân ẩn danh"}
                    </h4>
                    <Badge status={apt.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {apt.schedule?.date || "Không xác định"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeSlot}
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-start">
                {apt.status === AppointmentStatus.PENDING && (
                    <>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onConfirm(apt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-sm"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Xác nhận
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancel(apt.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1"
                        >
                            <XCircle className="w-4 h-4" />
                            Từ chối
                        </Button>
                    </>
                )}

                {apt.status === AppointmentStatus.CONFIRMED && (
                    <>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onOpenComplete(apt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-sm"
                        >
                            <FileText className="w-4 h-4" />
                            Khám xong
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancel(apt.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1"
                        >
                            <XCircle className="w-4 h-4" />
                            Hủy hẹn
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
