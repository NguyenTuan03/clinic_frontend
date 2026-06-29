"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { AppointmentStatus } from "../../../types";

export default function DoctorAppointmentsClient() {
  const { appointments, updateAppointmentStatus } = useApp();
  const { user: currentUser } = useAuth();

  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  if (!currentUser) return null;

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter(apt => apt.doctorId === currentUser.id);

  // Filter by status
  const filteredAppointments = doctorAppointments.filter(apt => {
    if (filterStatus === "ALL") return true;
    return apt.status === filterStatus;
  });

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

  return (
    <Card className="border-zinc-100 dark:border-zinc-800/50 animate-fadeIn">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <span>Danh sách cuộc hẹn bệnh nhân</span>
        </CardTitle>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold self-start sm:self-center">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              filterStatus === "ALL"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus(AppointmentStatus.PENDING)}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              filterStatus === AppointmentStatus.PENDING
                ? "bg-white dark:bg-zinc-900 text-amber-600 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-amber-500"
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => setFilterStatus(AppointmentStatus.CONFIRMED)}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              filterStatus === AppointmentStatus.CONFIRMED
                ? "bg-white dark:bg-zinc-900 text-sky-600 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-sky-500"
            }`}
          >
            Đã xác nhận
          </button>
          <button
            onClick={() => setFilterStatus(AppointmentStatus.COMPLETED)}
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              filterStatus === AppointmentStatus.COMPLETED
                ? "bg-white dark:bg-zinc-900 text-emerald-600 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-emerald-500"
            }`}
          >
            Khám xong
          </button>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-0">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
            Không tìm thấy cuộc hẹn nào.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div key={apt.id} className="p-6 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Patient Info */}
              <div className="flex-1 space-y-2.5">
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

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-sm border border-zinc-100 dark:border-zinc-900 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <strong className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-0.5">Triệu chứng/Yêu cầu:</strong>
                  {apt.symptoms}
                </div>

                {apt.notes && (
                  <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl text-sm border border-emerald-100/40 dark:border-emerald-900/20 leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-semibold block mb-0.5">Chẩn đoán y tế:</strong>
                    {apt.notes}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-start">
                {apt.status === AppointmentStatus.PENDING && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConfirm(apt.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Xác nhận
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(apt.id)}
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
                      onClick={() => handleOpenComplete(apt.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Khám xong
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(apt.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1"
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
    </Card>
  );
}
