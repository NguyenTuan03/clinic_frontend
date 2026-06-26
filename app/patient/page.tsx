"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/app-context";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  HeartPulse,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Activity,
  LogOut,
  AlertCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AppointmentStatus, UserRole, Specialty } from "../../types";

const SPECIALTY_LABELS = {
  [Specialty.GENERAL]: "Nội tổng quát",
  [Specialty.PEDIATRICS]: "Nhi khoa",
  [Specialty.CARDIOLOGY]: "Tim mạch",
  [Specialty.DERMATOLOGY]: "Da liễu",
  [Specialty.DENTISTRY]: "Nha khoa",
};

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

export default function PatientDashboard() {
  const { currentUser, doctors, appointments, bookAppointment, updateAppointmentStatus, logout } = useApp();
  const router = useRouter();

  // Form states for booking
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // default to tomorrow
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [bookingSlot, setBookingSlot] = useState(timeSlots[0]);
  const [symptoms, setSymptoms] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Protection Check
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (currentUser.role !== UserRole.PATIENT) {
      router.push("/doctor");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== UserRole.PATIENT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Trang này chỉ dành cho Bệnh nhân.</p>
          <Button variant="primary" onClick={() => router.push("/login")}>Đi tới Đăng nhập</Button>
        </div>
      </div>
    );
  }

  // Filter appointments for this patient
  const patientAppointments = appointments.filter(apt => apt.patientId === currentUser.id);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !bookingDate || !bookingSlot || !symptoms.trim()) {
      setFormError("Vui lòng nhập đầy đủ các trường và triệu chứng");
      return;
    }

    setFormError("");
    bookAppointment(selectedDoctorId, bookingDate, bookingSlot, symptoms);
    setSymptoms("");
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000); // hide success alert after 5s
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt lịch này không?")) {
      updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
    }
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
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block -mt-1">Cổng Bệnh nhân</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-zinc-950 dark:text-white block">{currentUser.name}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 block">{currentUser.phone}</span>
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

      {/* Content grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid lg:grid-cols-12 gap-8">

        {/* Left Side: Booking Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Đặt lịch hẹn mới</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>Yêu cầu đặt lịch đã được gửi! Chờ bác sĩ xác nhận.</span>
                </div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                {/* Doctor Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Chọn bác sĩ chuyên khoa
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                  >
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - Chuyên khoa {SPECIALTY_LABELS[doc.specialty]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <Input
                  label="Chọn ngày khám"
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]} // limit past dates
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />

                {/* Time Slot Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Chọn khung giờ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setBookingSlot(slot)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${bookingSlot === slot
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500"
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptoms Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Triệu chứng hoặc Lý do khám
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Mô tả ngắn gọn vấn đề sức khỏe của bạn (ví dụ: đau họng, nhức đầu 2 ngày nay...)"
                    rows={4}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm leading-relaxed"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full shadow-md shadow-emerald-600/10">
                  Gửi yêu cầu đặt hẹn
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Appointment List */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Lịch hẹn của bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-0">
              {patientAppointments.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                  Bạn chưa đăng ký lịch hẹn nào. Hãy đặt lịch hẹn đầu tiên ở mẫu bên cạnh.
                </div>
              ) : (
                patientAppointments.map((apt) => (
                  <div key={apt.id} className="p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                          {apt.doctorName}
                        </h4>
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          {SPECIALTY_LABELS[apt.specialty]}
                        </span>
                        <Badge status={apt.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
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
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-0.5">Triệu chứng của bạn:</strong>
                        <span className="text-zinc-600 dark:text-zinc-400 block leading-relaxed">{apt.symptoms}</span>
                      </div>

                      {apt.notes && (
                        <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl text-sm border border-emerald-100/40 dark:border-emerald-900/20">
                          <strong className="text-emerald-700 dark:text-emerald-400 font-semibold block mb-0.5">Lời khuyên của bác sĩ:</strong>
                          <span className="text-zinc-700 dark:text-zinc-300 block leading-relaxed">{apt.notes}</span>
                        </div>
                      )}
                    </div>

                    {(apt.status === AppointmentStatus.PENDING || apt.status === AppointmentStatus.CONFIRMED) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1 self-end sm:self-start shrink-0"
                      >
                        <XCircle className="w-4 h-4" />
                        Hủy hẹn
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
