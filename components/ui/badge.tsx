import React from "react";
import { AppointmentStatus } from "../../types";

interface BadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function Badge({ status, className = "" }: BadgeProps) {
  const styles = {
    [AppointmentStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    [AppointmentStatus.CONFIRMED]: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
    [AppointmentStatus.DONE]: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    [AppointmentStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  };

  const labels = {
    [AppointmentStatus.PENDING]: "Chờ xác nhận",
    [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
    [AppointmentStatus.DONE]: "Đã hoàn thành",
    [AppointmentStatus.CANCELLED]: "Đã hủy",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]} ${className}`}
    >
      {labels[status]}
    </span>
  );
}
