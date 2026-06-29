import DoctorAppointmentsClient from "@/components/doctor/appointments/DoctorAppointmentsClient";
import { getAppointmentsServer } from "@/services/appointment";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý lịch hẹn bệnh nhân | Phòng khám Đa khoa Tâm An",
  description: "Cổng phê duyệt, từ chối và quản lý lịch khám bệnh nhân dành cho Bác sĩ.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DoctorAppointmentsPage() {
  const queryClient = new QueryClient();

  // Prefetch danh sách cuộc hẹn (appointments)
  await queryClient.prefetchQuery({
    queryKey: ["appointments"],
    queryFn: getAppointmentsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorAppointmentsClient />
    </HydrationBoundary>
  );
}
