import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import LoginForm from "../../../components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đăng nhập tài khoản | Phòng khám Đa khoa Tâm An',
  description: 'Đăng nhập vào hệ thống Phòng khám Đa khoa Tâm An để đặt lịch hẹn khám bệnh và quản lý lịch biểu nhanh chóng, thuận tiện.',
  icons: {
    icon: "/clinic_icon.jpg",
    apple: "/clinic_icon.jpg",
  },
  alternates: {
    canonical: 'https://cliniccare-omega.vercel.app/login',
  },
  openGraph: {
    title: 'Đăng nhập tài khoản | Phòng khám Đa khoa Tâm An',
    description: 'Đăng nhập vào hệ thống Phòng khám Đa khoa Tâm An để đặt lịch hẹn khám bệnh và quản lý lịch biểu nhanh chóng, thuận tiện.',
    url: 'https://cliniccare-omega.vercel.app/login',
    siteName: 'Tâm An Clinic',
    images: [
      {
        url: "https://cliniccare-omega.vercel.app/clinic_icon.jpg",
        width: 1200,
        height: 630,
        alt: "Tâm An Clinic Logo",
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center px-4 bg-slate-50/50 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Chào mừng quay trở lại</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center border-t border-zinc-50 dark:border-zinc-800/50">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
