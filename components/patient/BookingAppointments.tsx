"use client";

import { AlertCircle, ShieldCheck, User, Clock } from "lucide-react";
import { CardContent } from "../ui/card";
import { formatTime } from "@/helpers/formatTime";
import { useCallback, useEffect, useState } from "react";
import { AppointmentStatus, Schedule } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { getSchedulesServer } from "@/services/schedule";
import { Dropdown, type DropdownOption } from "../ui/dropdown";

export default function BookingAppointmentComp() {
  const { appointments, bookAppointment } = useApp();
  const { data: schedules = [], isLoading, isError } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: getSchedulesServer,
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Lấy danh sách bác sĩ duy nhất có lịch rảnh từ API
  const doctorsFromSchedules = Array.from(
    new Map(
      schedules
        .filter(s => s.user)
        .map(s => [s.user_id, { id: String(s.user_id), name: s.user.name }])
    ).values()
  );

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const checkIsBooked = useCallback((scheduleId: number) => {
    return appointments.some(
      apt => Number(apt.schedule_id) === scheduleId && apt.status !== AppointmentStatus.CANCELLED
    );
  }, [appointments]);

  // Đồng bộ chọn bác sĩ đầu tiên khi danh sách tải xong
  useEffect(() => {
    if (doctorsFromSchedules.length > 0 && !selectedDoctorId) {
      const timer = setTimeout(() => {
        setSelectedDoctorId(doctorsFromSchedules[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [doctorsFromSchedules, selectedDoctorId]);

  // Sync selectedScheduleId khi đổi bác sĩ
  useEffect(() => {
    const doctorSchedules = schedules.filter(s => s.user_id === Number(selectedDoctorId) && !checkIsBooked(s.id));
    const targetId = doctorSchedules.length > 0 ? String(doctorSchedules[0].id) : "";
    const timer = setTimeout(() => setSelectedScheduleId(targetId), 0);
    return () => clearTimeout(timer);
  }, [selectedDoctorId, schedules, checkIsBooked]);

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const doctorSchedules = schedules.filter(s => s.user_id === Number(doctorId) && !checkIsBooked(s.id));
    setSelectedScheduleId(doctorSchedules.length > 0 ? String(doctorSchedules[0].id) : "");
  };

  const availableSchedules = schedules
    .filter(s => s.user_id === Number(selectedDoctorId) && !checkIsBooked(s.id))
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start_time.localeCompare(b.start_time);
    });

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

  const doctorOptions: DropdownOption[] = doctorsFromSchedules.map(doc => ({
    value: doc.id,
    label: doc.name,
  }));

  const scheduleOptions: DropdownOption[] = availableSchedules.map(sch => ({
    value: String(sch.id),
    label: `Ngày ${sch.date}`,
    sublabel: `${formatTime(sch.start_time)} – ${formatTime(sch.end_time)}`,
  }));

  return (
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

      {isLoading && (
        <div className="mb-4 flex flex-col gap-2.5">
          <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-11 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-11 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      )}

      {isError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Không thể tải danh sách lịch rảnh. Vui lòng thử lại.</span>
        </div>
      )}

      <form onSubmit={handleBook} className={`space-y-4 ${isLoading ? "hidden" : ""}`}>
        {/* Doctor Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Bác sĩ
          </label>
          <Dropdown
            options={doctorOptions}
            value={selectedDoctorId}
            onChange={handleDoctorChange}
            placeholder="Chọn bác sĩ..."
            icon={<User className="w-4 h-4" />}
            emptyMessage="Không có bác sĩ khả dụng"
          />
        </div>

        {/* Schedule Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Khung giờ khám
          </label>
          {availableSchedules.length === 0 && selectedDoctorId ? (
            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-xs font-semibold leading-relaxed">
              Bác sĩ này chưa có lịch rảnh. Vui lòng chọn bác sĩ khác.
            </div>
          ) : (
            <Dropdown
              options={scheduleOptions}
              value={selectedScheduleId}
              onChange={setSelectedScheduleId}
              placeholder="Chọn khung giờ..."
              icon={<Clock className="w-4 h-4" />}
              emptyMessage="Chưa có khung giờ khả dụng"
            />
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
  );
}