"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar as CalendarIcon, Clock, XCircle } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/types";
import { formatTime } from "@/helpers/formatTime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointmentsServer, updateAppointmentStatusServerAction } from "@/services/appointment";

export default function PatientAppointmentsList() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, isError } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointmentsServer,
    enabled: !!currentUser,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) =>
      updateAppointmentStatusServerAction(String(id), AppointmentStatus.CANCELLED),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const patientAppointments = currentUser
    ? appointments.filter(apt => Number(apt.patient_id) === Number(currentUser.id))
    : [];

  const handleCancelAppointment = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt lịch này không?")) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <CardContent className="p-6 flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        ))}
      </CardContent>
    );
  }

  if (isError) {
    return (
      <CardContent className="p-6 text-center text-sm text-red-500 dark:text-red-400 font-semibold">
        Không thể tải danh sách lịch hẹn. Vui lòng thử lại.
      </CardContent>
    );
  }

  return (
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
            <div
              key={apt.id}
              className="p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                    {docName}
                  </h4>
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

              {(apt.status === AppointmentStatus.PENDING ||
                apt.status === AppointmentStatus.CONFIRMED) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelAppointment(apt.id)}
                    disabled={cancelMutation.isPending}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 font-semibold flex items-center gap-1 self-end sm:self-start shrink-0"
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelMutation.isPending ? "Đang hủy..." : "Hủy hẹn"}
                  </Button>
                )}
            </div>
          );
        })
      )}
    </CardContent>
  );
}
