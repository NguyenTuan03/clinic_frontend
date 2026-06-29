import React from "react";

export default function DashboardLayout({
  children,
  appointments,
  schedules,
}: {
  children: React.ReactNode;
  appointments: React.ReactNode;
  schedules: React.ReactNode;
}) {
  return (
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
  );
}
