"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../context/app-context";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { HeartPulse, ArrowRight } from "lucide-react";
import { Gender } from "../../../types";

export default function Register() {
  const { register } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: Gender.MALE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Họ và tên không được để trống";
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email không đúng định dạng";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Số điện thoại phải từ 10 số trở lên";
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    register(
      formData.name,
      formData.email,
      formData.phone,
      formData.gender,
      formData.dateOfBirth
    );
    router.push("/patient");
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
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Đăng ký tài khoản</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Dành cho bệnh nhân đăng ký lịch khám trực tuyến
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Họ và tên của bạn"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
            
            <Input
              label="Địa chỉ Email"
              type="email"
              placeholder="nguyenvana@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              label="Số điện thoại liên hệ"
              type="tel"
              placeholder="0987654321"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ngày sinh"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                error={errors.dateOfBirth}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value={Gender.MALE}>Nam</option>
                  <option value={Gender.FEMALE}>Nữ</option>
                  <option value={Gender.OTHER}>Khác</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Đăng ký và Đăng nhập <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-zinc-50 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Đã có tài khoản bệnh nhân?{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
