import LoadingComponent from "@/components/ui/loading";

export default function AppointmentsLoading() {
  return (
    <div className="py-8 flex flex-col justify-center min-h-[300px]">
      <LoadingComponent />
    </div>
  );
}
