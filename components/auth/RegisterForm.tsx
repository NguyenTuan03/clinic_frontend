"use client";

import React, { useState } from "react";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useRegister } from "@/hooks/useRegister";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const { register, isPending, isError, error: serverError } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự trở lên";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  const displayError = isError ? serverError : "";

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-xl text-xs font-semibold">
            {displayError}
          </div>
        )}

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
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <Input
          label="Nhập lại mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={isPending}
        >
          {isPending ? (
            "Đang xử lý..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Đăng ký tài khoản <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </CardContent>
  );
}
