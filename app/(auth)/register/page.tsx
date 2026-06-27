import Link from "next/link";
import { Card, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center px-4 bg-slate-50/50 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Đăng ký tài khoản</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Dành cho bệnh nhân đăng ký lịch khám trực tuyến
          </p>
        </CardHeader>
        <RegisterForm />
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
