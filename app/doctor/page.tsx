import { getAppointmentsServer } from "@/services/appointment";
import StatsCards from "@/components/doctor/dashboard/StatsCardContents";

export default async function DoctorDashboard() {
  // Lấy danh sách lịch hẹn ở Server Side
  const appointments = await getAppointmentsServer();

  return <StatsCards appointments={appointments} />;
}
