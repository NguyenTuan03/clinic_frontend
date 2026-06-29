"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Activity,
  AlertCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AppointmentStatus, Specialty } from "../../types";
import { formatTime } from "@/helpers/formatTime";

const SPECIALTY_LABELS = {
  [Specialty.GENERAL]: "Nội tổng quát",
  [Specialty.PEDIATRICS]: "Nhi khoa",
  [Specialty.CARDIOLOGY]: "Tim mạch",
  [Specialty.DERMATOLOGY]: "Da liễu",
  [Specialty.DENTISTRY]: "Nha khoa",
};

export default function PatientDashboard() {
  const { doctors, appointments, schedules, bookAppointment, updateAppointmentStatus } = useApp();
  const { user: currentUser } = useAuth();

  // Form states for booking
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const checkIsBooked = useCallback((scheduleId: number) => {
    return appointments.some(
      apt => Number(apt.schedule_id) === scheduleId && apt.status !== AppointmentStatus.CANCELLED
    );
  }, [appointments]);

  // Sync selectedScheduleId when schedules list finishes loading or doctor changes
  useEffect(() => {
    const doctorSchedules = schedules.filter(s => s.user_id === Number(selectedDoctorId) && !checkIsBooked(s.id));
    const targetId = doctorSchedules.length > 0 ? String(doctorSchedules[0].id) : "";
    
    const timer = setTimeout(() => {
      setSelectedScheduleId(targetId);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedDoctorId, schedules, checkIsBooked]);

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const doctorSchedules = schedules.filter(s => s.user_id === Number(doctorId) && !checkIsBooked(s.id));
    if (doctorSchedules.length > 0) {
      setSelectedScheduleId(String(doctorSchedules[0].id));
    } else {
      setSelectedScheduleId("");
    }
  };

  // Filter available schedules for the selected doctor
  const availableSchedules = schedules.filter(
    s => s.user_id === Number(selectedDoctorId) && !checkIsBooked(s.id)
  );

  // Filter appointments for this patient
  const patientAppointments = currentUser
    ? appointments.filter(apt => Number(apt.patient_id) === Number(currentUser.id))
    : [];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedScheduleId) {
      setFormError("Vui lòng chọn bác sĩ và khung giờ");
      return;
    }

    setFormError("");
    bookAppointment(selectedDoctorId, selectedScheduleId, "");
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const handleCancelAppointment = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt lịch này không?")) {
      updateAppointmentStatus(String(id), AppointmentStatus.CANCELLED);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid lg:grid-cols-12 gap-8">

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
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                >
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - Chuyên khoa {SPECIALTY_LABELS[doc.specialty]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Schedule/Time Slot Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Chọn khung giờ khám rảnh của bác sĩ
                </label>
                {availableSchedules.length === 0 ? (
                  <div className="p-3.5 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold leading-relaxed">
                    Bác sĩ hiện tại chưa thiết lập lịch rảnh khả dụng nào. Vui lòng quay lại sau hoặc chọn Bác sĩ khác.
                  </div>
                ) : (
                  <select
                    value={selectedScheduleId}
                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                  >
                    {availableSchedules
                      .sort((a, b) => {
                        if (a.date !== b.date) return a.date.localeCompare(b.date);
                        return a.start_time.localeCompare(b.start_time);
                      })
                      .map(sch => (
                        <option key={sch.id} value={String(sch.id)}>
                          Ngày {sch.date} ({formatTime(sch.start_time)} - {formatTime(sch.end_time)})
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full shadow-md shadow-emerald-600/10"
                disabled={availableSchedules.length === 0}
              >
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
              patientAppointments.map((apt) => {
                const docName = apt.schedule?.user?.name || "Bác sĩ Chuyên khoa";
                const start = formatTime(apt.schedule?.start_time);
                const end = formatTime(apt.schedule?.end_time);
                const timeSlot = `${start} - ${end}`;

                return (
                  <div key={apt.id} className="p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                          {docName}
                        </h4>
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          {SPECIALTY_LABELS[Specialty.GENERAL]}
                        </span>
                        <Badge status={apt.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
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
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
