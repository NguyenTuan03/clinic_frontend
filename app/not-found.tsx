import React from "react";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-6 animate-bounce">
          <FileQuestion className="h-10 w-10" />
        </div>
        
        <h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-950 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-400 mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          Không tìm thấy trang
        </h2>
        
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm">
          Đường dẫn bạn truy cập không tồn tại hoặc đã bị di dời. Vui lòng kiểm tra lại địa chỉ URL hoặc quay lại trang chủ.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/10 px-4 py-2.5 text-base gap-2 active:scale-[0.98]"
        >
          <Home className="h-4 w-4" /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
