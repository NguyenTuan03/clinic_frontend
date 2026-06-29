"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Clock,
  User,
  Check,
} from "lucide-react";
import { AppointmentStatus } from "../../types";

export default function DoctorDashboardClient() {
  const { appointments, updateAppointmentStatus } = useApp();
  const { user: currentUser } = useAuth();

  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

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

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter(apt => apt.doctorId === currentUser.id);

  // Filter appointments for Today
  const todayAppointments = doctorAppointments.filter(apt => apt.date === todayStr);

  // Calculate statistics
  const stats = {
    total: doctorAppointments.length,
    pending: doctorAppointments.filter(a => a.status === AppointmentStatus.PENDING).length,
    today: todayAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length,
    completed: doctorAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
  };

  const handleOpenComplete = (id: string) => {
    setSelectedAptId(id);
    setDiagnosisNotes("");
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = () => {
    if (!selectedAptId) return;
    updateAppointmentStatus(selectedAptId, AppointmentStatus.COMPLETED, diagnosisNotes);
    setShowCompleteModal(false);
    setSelectedAptId(null);
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
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Khám hôm nay</span>
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.today}</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardContent className="p-4 flex flex-col justify-center">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Đã hoàn thành</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
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
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-950 transition-colors ${
                    apt.status === AppointmentStatus.CONFIRMED 
                      ? "border-sky-500" 
                      : apt.status === AppointmentStatus.COMPLETED
                      ? "border-emerald-500"
                      : "border-amber-500"
                  }`} />
                  
                  <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                        <User className="w-4 h-4 text-zinc-400" />
                        Bệnh nhân: {apt.patientName}
                      </span>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        {apt.timeSlot}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20 p-2.5 rounded-lg">
                      <strong>Lý do khám:</strong> {apt.symptoms}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={apt.status} />
                      {apt.status === AppointmentStatus.CONFIRMED && (
                        <button
                          onClick={() => handleOpenComplete(apt.id)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 ml-auto flex items-center gap-0.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Xác nhận khám xong
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diagnosis Notes Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg">Ghi chú & Chỉ định chẩn đoán</CardTitle>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Điền tóm tắt kết quả điều trị hoặc chỉ định y tế cho bệnh nhân sau khi khám xong.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Kết quả chẩn đoán / Ghi chú đơn thuốc
                </label>
                <textarea
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Ví dụ: Bệnh nhân viêm họng hạt. Kê đơn thuốc kháng sinh uống 5 ngày. Tránh nước lạnh..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm leading-relaxed"
                  required
                />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowCompleteModal(false)}>
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompleteSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
              >
                Xác nhận hoàn thành
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
