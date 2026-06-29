import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { getSchedulesServer } from "@/services/schedule";
import AddScheduleButtonWithModal from "@/components/doctor/schedule/AddScheduleButtonWithModal";
import ScheduleListComponent from "@/components/doctor/schedule/ScheduleListComponent";

export default async function DoctorSchedulesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["schedules"],
    queryFn: getSchedulesServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6 animate-fadeIn">
        {/* Header toolbar with Add button */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Quản lý lịch rảnh khám bệnh</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Thiết lập và quản lý các khung giờ trống của bạn trên lịch tuần/tháng.</p>
          </div>
          <AddScheduleButtonWithModal />
        </div>

        {/* Schedules Calendar Display */}
        <Card className="border-zinc-100 dark:border-zinc-800/50">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 py-4">
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Lịch làm việc của tôi
            </CardTitle>
          </CardHeader>
          <ScheduleListComponent />
        </Card>
      </div>
    </HydrationBoundary>
  );
}
