"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
  const { mutate: login, isPending, isError, error: serverError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

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