"use client";

import React, { useEffect } from "react";
import ErrorComponent from "@/components/ui/error";

export default function SchedulesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi cấu hình lịch rảnh bác sĩ:", error);
  }, [error]);

  return (
    <div className="py-8 flex flex-col justify-center min-h-[300px]">
      <ErrorComponent 
        message="Không thể kết nối đến máy chủ để tải dữ liệu lịch rảnh của bạn." 
        onRetry={reset} 
      />
    </div>
  );
}
