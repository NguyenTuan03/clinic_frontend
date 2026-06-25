"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../context/app-context";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { HeartPulse, Stethoscope, User, ArrowRight } from "lucide-react";
import { UserRole } from "../../../types";

export default function Login() {
  const { login } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");
    const success = login(email, role);
    if (success) {
      if (role === UserRole.DOCTOR) {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    } else {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleQuickLogin = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
    const success = login(demoEmail, demoRole);
    if (success) {
      if (demoRole === UserRole.DOCTOR) {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50 dark:bg-zinc-950">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
          <HeartPulse className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg text-zinc-900 dark:text-white">Tâm An Clinic</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Chào mừng quay trở lại</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Chọn vai trò đăng nhập để tiếp tục truy cập hệ thống
          </p>
        </CardHeader>
        <CardContent>
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setRole(UserRole.PATIENT);
                setError("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${role === UserRole.PATIENT
                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
            >
              <User className="w-4 h-4" />
              <span>Bệnh nhân</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole(UserRole.DOCTOR);
                setError("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${role === UserRole.DOCTOR
                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Bác sĩ</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Địa chỉ Email"
              type="email"
              placeholder="nhap.email@cua.ban"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              disabled
              helperText="Mật khẩu hiện được bỏ qua để thuận tiện trải nghiệm thử nghiệm."
            />

            <Button type="submit" variant="primary" className="w-full mt-2">
              Đăng nhập <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-3 text-center">
              Tài khoản dùng thử nhanh
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("tuan@gmail.com", UserRole.PATIENT)}
                className="p-3 text-left border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5 transition-all text-xs cursor-pointer"
              >
                <strong className="font-semibold block text-zinc-800 dark:text-zinc-200">Vai trò Bệnh nhân</strong>
                <span className="text-zinc-500 dark:text-zinc-400">tuan@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("cuong.le@clinic.com", UserRole.DOCTOR)}
                className="p-3 text-left border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5 transition-all text-xs cursor-pointer"
              >
                <strong className="font-semibold block text-zinc-800 dark:text-zinc-200">Vai trò Bác sĩ Cường</strong>
                <span className="text-zinc-500 dark:text-zinc-400">cuong.le@clinic.com</span>
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center border-t border-zinc-50 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chưa có tài khoản bệnh nhân?{" "}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
