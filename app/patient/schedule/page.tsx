"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Search,
  Star,
  Activity,
  CalendarRange
} from "lucide-react";
import { Specialty } from "@/types";

const SPECIALTY_LABELS = {
  [Specialty.GENERAL]: "Nội tổng quát",
  [Specialty.PEDIATRICS]: "Nhi khoa",
  [Specialty.CARDIOLOGY]: "Tim mạch",
  [Specialty.DERMATOLOGY]: "Da liễu",
  [Specialty.DENTISTRY]: "Nha khoa",
};

export default function DoctorSchedulePage() {
  const { doctors } = useApp();
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock weekly schedule template for doctors
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  // Giả lập lịch trực cố định cho các bác sĩ (Ca Sáng: 8:00-12:00, Ca Chiều: 13:30-17:30)
  const getDoctorWeeklySchedule = (doctorId: string) => {
    // Để sinh động, mỗi bác sĩ sẽ trực các ngày khác nhau
    const hash = doctorId.charCodeAt(doctorId.length - 1) || 0;
    return daysOfWeek.map((day, idx) => {
      // Bác sĩ sẽ trực ca sáng hoặc chiều tùy thuộc vào chỉ số
      const morningActive = (hash + idx) % 2 === 0;
      const afternoonActive = (hash + idx * 2) % 3 !== 0;
      return {
        day,
        morning: morningActive ? "Trực khám" : "Nghỉ",
        afternoon: afternoonActive ? "Trực khám" : "Nghỉ"
      };
    });
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === "ALL" || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleBookRedirect = (doctorId: string) => {
    // Chuyển hướng sang trang đặt lịch kèm tham số doctorId
    router.push(`/patient?doctorId=${doctorId}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-6.5 h-6.5 text-emerald-600" />
            <span>Lịch trực & Đội ngũ Bác sĩ</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Xem lịch làm việc của từng bác sĩ để lựa chọn thời gian khám phù hợp nhất.
          </p>
        </div>

        {/* Search & Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full sm:w-60 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value as Specialty | "ALL")}
            className="px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-semibold"
          >
            <option value="ALL">Tất cả chuyên khoa</option>
            {Object.values(Specialty).map((spec) => (
              <option key={spec} value={spec}>
                {SPECIALTY_LABELS[spec]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl">
            Không tìm thấy bác sĩ nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const weeklySchedule = getDoctorWeeklySchedule(doc.id);
            return (
              <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Doctor Profile Brief (col span 4) */}
                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-5 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-850 pb-6 lg:pb-0 lg:pr-8 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800"
                    />
                    <div className="space-y-2.5 min-w-0 flex-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        Chuyên khoa: {SPECIALTY_LABELS[doc.specialty]}
                      </span>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white truncate">
                        {doc.name}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <span>{doc.experience} năm kinh nghiệm chuyên môn</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {doc.rating} / 5.0
                        </span>
                        <span>|</span>
                        <span>Đánh giá tốt</span>
                      </div>
                      <div className="pt-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookRedirect(doc.id)}
                          className="w-full sm:w-auto font-bold flex items-center gap-2"
                        >
                          <CalendarDays className="w-4 h-4" />
                          Đặt lịch khám ngay
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Weekly Schedule (col span 8) */}
                  <div className="lg:col-span-8 w-full space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      <Clock className="w-4.5 h-4.5 text-emerald-600" />
                      <span>Lịch trình khám tuần này</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {weeklySchedule.map((daySched) => {
                        const isMorningOff = daySched.morning === "Nghỉ";
                        const isAfternoonOff = daySched.afternoon === "Nghỉ";
                        return (
                          <div
                            key={daySched.day}
                            className="bg-slate-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-3 flex flex-col justify-between gap-3 text-center"
                          >
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                              {daySched.day}
                            </span>
                            <div className="space-y-1.5">
                              {/* Ca sáng */}
                              <div className="flex flex-col text-[10px]">
                                <span className="text-zinc-400 font-semibold">Sáng (8-12h)</span>
                                <span
                                  className={`inline-block py-0.5 rounded font-bold mt-0.5 ${
                                    isMorningOff
                                      ? "text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/50"
                                      : "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                                  }`}
                                >
                                  {daySched.morning}
                                </span>
                              </div>
                              {/* Ca chiều */}
                              <div className="flex flex-col text-[10px]">
                                <span className="text-zinc-400 font-semibold">Chiều (13-17h)</span>
                                <span
                                  className={`inline-block py-0.5 rounded font-bold mt-0.5 ${
                                    isAfternoonOff
                                      ? "text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/50"
                                      : "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                                  }`}
                                >
                                  {daySched.afternoon}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}
