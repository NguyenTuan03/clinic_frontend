"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorComponent({
  message = "Đã xảy ra lỗi khi kết nối tới hệ thống.",
  onRetry,
}: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto animate-fadeIn">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
      <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-1">
        Lỗi tải dữ liệu
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/20 dark:hover:bg-red-955/40 dark:text-red-400 border border-red-200/50 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all duration-200"
        >
          Thử lại ngay
        </button>
      )}
    </div>
  );
}
