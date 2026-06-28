"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { UserRole } from "@/types";

export default function HeroActions() {
  const { user: currentUser } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {currentUser ? (
        <Link href={currentUser.role === UserRole.DOCTOR ? "/doctor" : "/patient"}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Vào trang quản lý <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-600/20">
              Đăng ký lịch khám <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Đăng nhập Dashboard
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
