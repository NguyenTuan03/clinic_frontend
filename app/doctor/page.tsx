import { getAppointmentsServer } from "@/services/appointment";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import StatsCards from "@/components/doctor/dashboard/StatsCardContents";

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
