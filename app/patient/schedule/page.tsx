import { CalendarRange } from "lucide-react";
import DoctorScheduleClient from "@/components/patient/schedule/DoctorScheduleClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getSchedulesServer } from "@/services/schedule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch trực & Đội ngũ Bác sĩ | Phòng khám Đa khoa Tâm An",
  description: "Xem lịch làm việc của từng bác sĩ chuyên khoa tại Phòng khám Đa khoa Tâm An để chủ động lựa chọn thời gian khám phù hợp.",
  keywords: ["lịch trực bác sĩ", "lịch khám bác sĩ", "bác sĩ tâm an", "đội ngũ bác sĩ"],
};

export default async function DoctorSchedulePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["schedules"],
    queryFn: getSchedulesServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Title section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CalendarRange className="w-6 h-6 text-emerald-600" />
              <span>Lịch trực &amp; Đội ngũ Bác sĩ</span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Xem lịch làm việc của từng bác sĩ để lựa chọn thời gian khám phù hợp nhất.
            </p>
          </div>
        </div>

        {/* Client container containing search and list */}
        <DoctorScheduleClient />
      </main>
    </HydrationBoundary>
  );
}
