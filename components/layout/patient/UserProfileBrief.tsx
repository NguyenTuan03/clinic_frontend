"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, User } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";


export default function UserProfileBriefComponent() {
    const { user: currentUser } = useAuth();
    const router = useRouter();
    // Protection Check
    useEffect(() => {
        if (!currentUser) {
            router.push("/login");
            return;
        }
        if (currentUser.role !== UserRole.PATIENT) {
            router.push("/doctor");
        }
    }, [currentUser, router]);

    if (!currentUser || currentUser.role !== UserRole.PATIENT) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
                <div className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Không có quyền truy cập</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">Trang này chỉ dành cho Bệnh nhân.</p>
                    <Button variant="primary" onClick={() => router.push("/login")}>Đi tới Đăng nhập</Button>
                </div>
            </div>
        );
    }
    return (
        <>
            {/* User profile brief */}
            <div className="p-4 mx-4 mt-6 mb-4 bg-slate-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block truncate">
                        {currentUser.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
                        {currentUser.email}
                    </span>
                </div>
            </div>
        </>
    );
}