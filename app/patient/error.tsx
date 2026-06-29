"use client";

import React, { useEffect } from "react";
import ErrorComponent from "@/components/ui/error";

export default function PatientDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi Dashboard bệnh nhân:", error);
  }, [error]);

  return (
    <div className="py-8 flex flex-col justify-center min-h-[300px]">
      <ErrorComponent 
        message="Không thể kết nối đến máy chủ để tải thông tin lịch hẹn của bạn." 
        onRetry={reset} 
      />
    </div>
  );
}
