import { HeartPulse } from "lucide-react";
import NavigationSidebar from "@/components/layout/doctor/NavigationSidebar";
import LogoutComponent from "@/components/layout/doctor/LogoutComp";
import { headers } from "next/headers";

export default async function DoctorLayout({
  children,
  appointments,
  schedules
}: {
  children: React.ReactNode;
  appointments?: React.ReactNode;
  schedules?: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPathname = headersList.get("x-pathname") || "/";

  const isDashboard = currentPathname === "/doctor";

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-white block">Tâm An Clinic</span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block -mt-1">Hệ thống Bác sĩ</span>
            </div>
          </div>
          {/* Logout Component */}
          <LogoutComponent />
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid lg:grid-cols-12 gap-8">

        {/* Navigation Sidebar */}
        <NavigationSidebar />

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {isDashboard ? (
            <>
              {/* Dashboard stats */}
              {children}

              {/* Grid song song: Lịch hẹn & Lịch rảnh */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Lịch hẹn bệnh nhân
                    </h3>
                  </div>
                  {appointments}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Cấu hình lịch biểu rảnh
                    </h3>
                  </div>
                  {schedules}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Render children for other routes */}
              {children}

              {/* Render parallel slots invisibly to allow Next.js routing resolution */}
              <div className="hidden">
                {appointments}
                {schedules}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
