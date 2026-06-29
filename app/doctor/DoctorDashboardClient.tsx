"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Clock,
  User,
} from "lucide-react";
import { AppointmentStatus } from "../../types";
import { formatTime } from "@/helpers/formatTime";

export default function DoctorDashboardClient() {
  const { appointments } = useApp();
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  // Get current date string in YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayString();

  // Filter appointments for this doctor (checking schedule user id)
  const doctorAppointments = appointments.filter(
    (apt) => apt.schedule?.user?.id === Number(currentUser.id)
  );

  // Filter appointments for Today
  const todayAppointments = doctorAppointments.filter((apt) => apt.schedule?.date === todayStr);

  // Calculate statistics
  const stats = {
    total: doctorAppointments.length,
    pending: doctorAppointments.filter((a) => a.status === AppointmentStatus.PENDING).length,
    today: todayAppointments.filter((a) => a.status === AppointmentStatus.CONFIRMED).length,
    cancelled: doctorAppointments.filter((a) => a.status === AppointmentStatus.CANCELLED).length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Chờ duyệt</span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Hôm nay</span>
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.today}</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Đã hủy</span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Tổng lịch hẹn</span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</span>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Timeline */}
      <Card className="border-zinc-100 dark:border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Lịch trình khám hôm nay ({todayStr})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayAppointments.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
              Hôm nay bạn không có lịch hẹn khám nào.
            </div>
          ) : (
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 pl-6 space-y-6 py-2">
              {todayAppointments.map((apt) => {
                const start = formatTime(apt.schedule?.start_time);
                const end = formatTime(apt.schedule?.end_time);
                const timeSlot = `${start} - ${end}`;

                return (
                  <div key={apt.id} className="relative group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-950 transition-colors ${
                        apt.status === AppointmentStatus.CONFIRMED
                          ? "border-sky-500"
                          : apt.status === AppointmentStatus.CANCELLED
                          ? "border-red-500"
                          : "border-amber-500"
                      }`}
                    />

                    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                          <User className="w-4 h-4 text-zinc-400" />
                          Bệnh nhân: {apt.patient?.name || "Bệnh nhân ẩn danh"}
                        </span>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5" />
                          {timeSlot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={apt.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
