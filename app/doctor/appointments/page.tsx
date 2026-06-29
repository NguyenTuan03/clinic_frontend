import DoctorAppointmentsClient from "@/components/doctor/appointments/DoctorAppointmentsClient";
import { getAppointmentsServer } from "@/services/appointment";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

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
