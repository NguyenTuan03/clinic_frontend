import { HeartPulse } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50 dark:bg-zinc-950">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
          <HeartPulse className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg text-zinc-900 dark:text-white">Tâm An Clinic</span>
      </Link>

      {children}
    </div>
  );
}