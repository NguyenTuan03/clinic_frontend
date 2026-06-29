import LoadingComponent from "@/components/ui/loading";

export default function DoctorDashboardLoading() {
  return (
    <div className="py-8 flex flex-col justify-center min-h-[200px]">
      <LoadingComponent />
    </div>
  );
}
