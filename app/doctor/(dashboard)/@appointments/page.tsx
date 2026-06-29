import AppointmentsSummary from "@/components/doctor/appointments/AppointmentsSummary";
import { getAppointmentsServer } from "@/services/appointment";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function DoctorAppointmentsSlot() {
  const queryClient = new QueryClient();

  // Prefetch danh sách cuộc hẹn của bác sĩ
  await queryClient.prefetchQuery({
    queryKey: ["appointments"],
    queryFn: getAppointmentsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentsSummary />
    </HydrationBoundary>
  );
}