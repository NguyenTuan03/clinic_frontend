"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  HeartPulse,
  Calendar as CalendarIcon,
  Clock,
  User,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { AppointmentStatus, UserRole } from "../../types";

export default function DoctorDashboard() {
  const { appointments, updateAppointmentStatus } = useApp();
  const { user: currentUser, logout } = useAuth();
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Protection Check
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (currentUser.role !== UserRole.DOCTOR) {
      router.push("/patient");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== UserRole.DOCTOR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Trang này chỉ dành cho Bác sĩ.</p>
          <Button variant="primary" onClick={() => router.push("/login")}>Đi tới Đăng nhập</Button>
        </div>
      </div>
    );
  }

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter(apt => apt.doctorId === currentUser.id);

  // Filter by status
  const filteredAppointments = doctorAppointments.filter(apt => {
    if (filterStatus === "ALL") return true;
    return apt.status === filterStatus;
  });

  // Calculate statistics
  const stats = {
    total: doctorAppointments.length,
    pending: doctorAppointments.filter(a => a.status === AppointmentStatus.PENDING).length,
    confirmed: doctorAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length,
    completed: doctorAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
  };

  // Timeline slots in clinic work hours (08:00 - 17:00)
  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:30 - 14:30",
    "14:30 - 15:30",
    "15:30 - 16:30",
    "16:30 - 17:30"
  ];

  // Group booked appointments for today/tomorrow (we'll assume all are scheduled for the current workflow date)
  const getAppointmentBySlot = (slot: string) => {
    // Lấy cuộc hẹn CONFIRMED hoặc PENDING trong slot này
    return doctorAppointments.find(
      apt => apt.timeSlot === slot &&
        (apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING)
    );
  };

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, AppointmentStatus.CONFIRMED);
  };

  const handleCancel = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy cuộc hẹn này không?")) {
      updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
    }
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Tâm An Clinic</span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block -mt-1">Hệ thống Bác sĩ</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-zinc-950 dark:text-white block">{currentUser.name}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 block">Bác sĩ chuyên khoa</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid lg:grid-cols-12 gap-8">

        {/* Left Side: Stats and Appointments List */}
        <div className="lg:col-span-8 space-y-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Tổng cuộc hẹn</span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.total}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Chờ xác nhận</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Đã xác nhận</span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.confirmed}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">Đã khám xong</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
              </CardContent>
            </Card>
          </div>

          {/* List Card */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Danh sách cuộc hẹn bệnh nhân</span>
              </CardTitle>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterStatus("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === "ALL"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus(AppointmentStatus.PENDING)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === AppointmentStatus.PENDING
                    ? "bg-white dark:bg-zinc-900 text-amber-600 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-amber-500"
                    }`}
                >
                  Chờ xác nhận
                </button>
                <button
                  onClick={() => setFilterStatus(AppointmentStatus.CONFIRMED)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === AppointmentStatus.CONFIRMED
                    ? "bg-white dark:bg-zinc-900 text-sky-600 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-sky-500"
                    }`}
                >
                  Đã xác nhận
                </button>
                <button
                  onClick={() => setFilterStatus(AppointmentStatus.COMPLETED)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === AppointmentStatus.COMPLETED
                    ? "bg-white dark:bg-zinc-900 text-emerald-600 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-emerald-500"
                    }`}
                >
                  Đã hoàn thành
                </button>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-0">
              {filteredAppointments.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
                  Không tìm thấy cuộc hẹn nào phù hợp.
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div key={apt.id} className="p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 text-base">
                          <User className="w-4.5 h-4.5 text-zinc-400" />
                          {apt.patientName}
                        </h4>
                        <Badge status={apt.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.timeSlot}
                        </span>
                      </div>

                      <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-sm border border-zinc-100 dark:border-zinc-900">
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-0.5">Triệu chứng/Yêu cầu khám:</strong>
                        <span className="text-zinc-600 dark:text-zinc-400 block leading-relaxed">{apt.symptoms}</span>
                      </div>

                      {apt.notes && (
                        <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl text-sm border border-emerald-100/40 dark:border-emerald-900/20">
                          <strong className="text-emerald-700 dark:text-emerald-400 font-semibold block mb-0.5">Chẩn đoán & Ghi chú y học:</strong>
                          <span className="text-zinc-700 dark:text-zinc-300 block leading-relaxed">{apt.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons based on current state */}
                    <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-start">
                      {apt.status === AppointmentStatus.PENDING && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirm(apt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Xác nhận
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(apt.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1"
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
                            onClick={() => handleOpenComplete(apt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            Khám xong
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(apt.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Hủy hẹn
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Timeline & Schedule */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <span>Lịch trình khám hôm nay</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
                Các khung giờ khám chính
              </div>
              <div className="space-y-3">
                {timeSlots.map((slot) => {
                  const apt = getAppointmentBySlot(slot);
                  return (
                    <div
                      key={slot}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${apt
                        ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20"
                        : "bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${apt ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`} />
                        <div>
                          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block leading-tight">
                            {slot}
                          </span>
                          {apt && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 block mt-0.5 truncate max-w-[150px]">
                              Bệnh nhân: {apt.patientName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {apt ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">
                            Có hẹn
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">
                            Trống
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Diagnosis Notes Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Ghi chú & Chỉ định chẩn đoán</CardTitle>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Điền tóm tắt triệu chứng lâm sàng và chỉ định y tế cho bệnh nhân.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Ghi chú điều trị / Đơn thuốc
                </label>
                <textarea
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Ví dụ: Bệnh nhân đau dạ dày nhẹ. Cho đơn thuốc uống sau ăn 30 phút. Hẹn tái khám sau 2 tuần..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm leading-relaxed"
                />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowCompleteModal(false)}>
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompleteSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
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
