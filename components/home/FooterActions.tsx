"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function FooterActions() {
  const { user: currentUser } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {currentUser ? (
        <Link href="/patient">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto text-emerald-950 font-bold bg-white hover:bg-emerald-50">
            Đặt lịch khám ngay
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-emerald-950 font-bold bg-white hover:bg-emerald-50">
              Đăng ký tài khoản
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              Đăng nhập hệ thống
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
