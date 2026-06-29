import { HeartPulse } from "lucide-react";
import NavigationSidebar from "@/components/layout/doctor/NavigationSidebar";
import LogoutComponent from "@/components/layout/doctor/LogoutComp";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {children}
        </main>
      </div>
    </div>
  );
}
