import SchedulesSummary from "@/components/doctor/schedule/SchedulesSummary";
import { getSchedulesServer } from "@/services/schedule";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function DoctorSchedulesSlotPage() {
  const queryClient = new QueryClient();

  // Prefetch danh sách lịch rảnh của bác sĩ
  await queryClient.prefetchQuery({
    queryKey: ["schedules"],
    queryFn: getSchedulesServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SchedulesSummary />
    </HydrationBoundary>
  );
}
