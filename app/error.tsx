"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 mb-6 animate-pulse">
          <AlertOctagon className="h-10 w-10" />
        </div>
        
        <h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-700 to-red-950 dark:from-red-400 dark:via-rose-500 dark:to-red-700 mb-2">
          500
        </h1>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          Đã xảy ra sự cố hệ thống
        </h2>
        
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm">
          Máy chủ đang gặp sự cố kỹ thuật hoặc API tạm thời không phản hồi. Vui lòng thử tải lại trang hoặc quay về trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/10 px-4 py-2.5 text-base gap-2 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Thử tải lại
          </button>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 px-4 py-2.5 text-base gap-2 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
