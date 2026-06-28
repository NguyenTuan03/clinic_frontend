"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function LoginForm() {
  const { login, isPending, isError, error: serverError } = useLogin();
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Tự động chuyển hướng nếu người dùng đã đăng nhập trước đó
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.DOCTOR) {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setValidationError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!email.includes("@")) {
      setValidationError("Email không hợp lệ");
      return;
    }

    setValidationError("");
    login({ email, password });
  };

  const displayError = validationError || (isError ? serverError : "");

  if (user) {
    return (
      <div className="text-center py-4">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
          Đang chuyển hướng vào hệ thống...
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-xl text-xs font-semibold">
          {displayError}
        </div>
      )}
      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="nhap.email@cua.ban"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
            Đăng nhập <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
}