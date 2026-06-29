import { AppointmentStatus } from "@/types";

interface FilterStatusProps {
    value: AppointmentStatus | "ALL";
    onChange: (status: AppointmentStatus | "ALL") => void;
}

const FILTER_OPTIONS: {
    label: string;
    value: AppointmentStatus | "ALL";
    activeClass: string;
    hoverClass: string;
}[] = [
        {
            label: "Tất cả",
            value: "ALL",
            activeClass: "text-zinc-900 dark:text-white",
            hoverClass: "hover:text-zinc-900 dark:hover:text-white",
        },
        {
            label: "Chờ duyệt",
            value: AppointmentStatus.PENDING,
            activeClass: "text-amber-600",
            hoverClass: "hover:text-amber-500",
        },
        {
            label: "Đã xác nhận",
            value: AppointmentStatus.CONFIRMED,
            activeClass: "text-sky-600",
            hoverClass: "hover:text-sky-500",
        },
        {
            label: "Khám xong",
            value: AppointmentStatus.DONE,
            activeClass: "text-emerald-600",
            hoverClass: "hover:text-emerald-500",
        },
    ];

export default function FilterStatus({ value, onChange }: FilterStatusProps) {
    return (
        <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold self-start sm:self-center">
            {FILTER_OPTIONS.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${isActive
                                ? `bg-white dark:bg-zinc-900 shadow-xs ${option.activeClass}`
                                : `text-zinc-500 dark:text-zinc-400 ${option.hoverClass}`
                            }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}