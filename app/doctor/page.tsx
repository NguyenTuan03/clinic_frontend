import { getAppointmentsServer } from "@/services/appointment";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import StatsCards from "@/components/doctor/dashboard/StatsCardContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tổng quan Bác sĩ | Phòng khám Đa khoa Tâm An",
  description: "Cổng thông tin quản lý tổng quan lịch trình và số lượng cuộc hẹn khám bệnh của Bác sĩ.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DoctorDashboard() {
  const queryClient = new QueryClient();

  // Prefetch danh sách lịch hẹn của bác sĩ để nạp vào cache
  await queryClient.prefetchQuery({
    queryKey: ["appointments"],
    queryFn: getAppointmentsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsCards />
    </HydrationBoundary>
  );
}
