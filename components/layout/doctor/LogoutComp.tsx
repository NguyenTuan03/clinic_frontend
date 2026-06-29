"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LogoutComponent() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        router.push("/login");
    }

    return (
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <span className="text-sm font-bold text-zinc-950 dark:text-white block">{user.name}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 block">Bác sĩ chuyên khoa</span>
            </div>
            <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer active:scale-90"
                title="Đăng xuất"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    );
}