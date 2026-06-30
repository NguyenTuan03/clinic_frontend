import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Activity } from "lucide-react";
import BookingAppointmentComp from "@/components/patient/BookingAppointments";
import PatientAppointmentsList from "@/components/patient/PatientAppointmentsList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getSchedulesServer } from "@/services/schedule";
import { getAppointmentsServer } from "@/services/appointment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lịch hẹn & Quản lý lịch khám | Phòng khám Đa khoa Tâm An",
  description: "Trang đặt lịch khám bệnh trực tuyến và theo dõi tình trạng lịch hẹn với các bác sĩ chuyên khoa tại Phòng khám Đa khoa Tâm An.",
  keywords: ["đặt lịch khám", "phòng khám tâm an", "lịch hẹn khám bệnh", "tâm an clinic"],
};

export default async function PatientDashboard() {
  const queryClient = new QueryClient();

  // Prefetch cả lịch rảnh và lịch hẹn của bệnh nhân trên Server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["schedules"],
      queryFn: getSchedulesServer,
    }),
    queryClient.prefetchQuery({
      queryKey: ["appointments"],
      queryFn: getAppointmentsServer,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
            {/* Booking form */}
            <BookingAppointmentComp />
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
            {/* Appointment list */}
            <PatientAppointmentsList />
          </Card>
        </div>
      </main>
    </HydrationBoundary>
  );
}
