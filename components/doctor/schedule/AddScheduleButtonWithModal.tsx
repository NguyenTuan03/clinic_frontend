"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import AddScheduleComponent from "./AddScheduleComponent";

export default function AddScheduleButtonWithModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/10 text-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm khung giờ rảnh</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <Card className="w-full max-w-md shadow-xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
            <CardHeader className="relative pr-12 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
              <CardTitle className="text-lg">Thiết lập lịch rảnh mới</CardTitle>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Chọn ngày và khung giờ bạn trống để bệnh nhân có thể đặt lịch khám.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <div className="pt-4">
              <AddScheduleComponent onSuccess={() => setIsOpen(false)} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
