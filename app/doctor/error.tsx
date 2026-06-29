"use client";

import React, { useEffect } from "react";
import ErrorComponent from "@/components/ui/error";

export default function DoctorDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi trên Dashboard:", error);
  }, [error]);

  return (
    <div className="py-8 flex flex-col justify-center min-h-[250px]">
      <ErrorComponent 
        message="Không thể kết nối đến máy chủ để tải dữ liệu tổng quan." 
        onRetry={reset} 
      />
    </div>
  );
}
