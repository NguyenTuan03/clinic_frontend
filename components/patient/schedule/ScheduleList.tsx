"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/helpers/formatTime";
import { getSchedulesServer } from "@/services/schedule";
import { Schedule } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ScheduleListComponentProps {
  searchQuery: string;
}

export default function ScheduleListComponent({ searchQuery }: ScheduleListComponentProps) {
  const router = useRouter();
  const { data: schedules = [], isLoading, isError } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: getSchedulesServer,
  });

  // Nhóm schedules theo bác sĩ (user_id)
  const doctorGroups = useMemo(() => {
    const map = new Map<number, { name: string; email: string; schedules: Schedule[] }>();
    for (const sch of schedules) {
      if (!sch.user) continue;
      const existing = map.get(sch.user_id);
      if (existing) {
        existing.schedules.push(sch);
      } else {
        map.set(sch.user_id, {
          name: sch.user.name,
          email: sch.user.email,
          schedules: [sch],
        });
      }
    }
    return Array.from(map.values());
  }, [schedules]);

  const filteredDoctors = useMemo(() => {
    return doctorGroups.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doctorGroups, searchQuery]);

  const handleBookRedirect = (doctorId: number) => {
    router.push(`/patient?doctorId=${doctorId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-52 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500 dark:text-red-400 font-semibold bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl">
        Không thể tải lịch bác sĩ. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl">
          Không tìm thấy bác sĩ nào phù hợp.
        </div>
      ) : (
        filteredDoctors.map((doc) => {
          const sortedSchedules = [...doc.schedules].sort((a, b) =>
            a.date.localeCompare(b.date)
          );

          return (
            <Card key={doc.email} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 grid lg:grid-cols-12 gap-8 items-start">
                {/* Doctor Profile (col span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 pb-6 lg:pb-0 lg:pr-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <Stethoscope className="w-3 h-3" />
                      Bác sĩ chuyên khoa
                    </span>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {doc.name}
                    </h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{doc.email}</p>
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-emerald-500" />
                    <span>{doc.schedules.length} lịch rảnh khả dụng</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const firstSched = schedules.find(s => s.user?.email === doc.email);
                      if (firstSched) {
                        handleBookRedirect(firstSched.user_id);
                      }
                    }}
                    className="w-full font-bold flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Đặt lịch khám ngay
                  </Button>
                </div>

                {/* Schedule slots (col span 8) */}
                <div className="lg:col-span-8 w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Lịch rảnh ({sortedSchedules.length} ca)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {sortedSchedules.map((sch) => (
                      <div
                        key={sch.id}
                        className="bg-slate-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-3.5 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            {sch.date}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {formatTime(sch.start_time)} – {formatTime(sch.end_time)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}