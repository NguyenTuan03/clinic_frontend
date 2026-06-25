"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../context/app-context";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  HeartPulse,
  Calendar,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Clock,
  Phone,
  MapPin,
  Star
} from "lucide-react";
import { Specialty } from "../types";

const SPECIALTY_LABELS = {
  [Specialty.GENERAL]: "Nội tổng quát",
  [Specialty.PEDIATRICS]: "Nhi khoa",
  [Specialty.CARDIOLOGY]: "Tim mạch",
  [Specialty.DERMATOLOGY]: "Da liễu",
  [Specialty.DENTISTRY]: "Nha khoa",
};

export default function Home() {
  const { doctors, currentUser, logout } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-zinc-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg leading-tight tracking-tight block text-zinc-900 dark:text-white">
                Tâm An Clinic
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase block -mt-0.5">
                Chăm sóc tận tâm
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <a href="#about" className="hover:text-emerald-600 transition-colors">Về chúng tôi</a>
            <a href="#services" className="hover:text-emerald-600 transition-colors">Chuyên khoa</a>
            <a href="#doctors" className="hover:text-emerald-600 transition-colors">Đội ngũ bác sĩ</a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Chào, <strong className="font-semibold text-zinc-900 dark:text-white">{currentUser.name}</strong>
                </span>
                <Link href={currentUser.role === "DOCTOR" ? "/doctor" : "/patient"}>
                  <Button variant="primary" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>Đăng xuất</Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="hidden sm:inline-flex">Đăng ký ngay</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 flex flex-col text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold self-start mb-6 border border-emerald-100 dark:border-emerald-500/20">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Tiêu chuẩn y tế quốc tế</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
                Chăm sóc sức khỏe <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                  toàn diện cho gia đình bạn
                </span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-[60ch] leading-relaxed mb-8">
                Đặt lịch khám nhanh chóng với đội ngũ bác sĩ chuyên khoa đầu ngành. Trải nghiệm y tế tiện lợi, chuyên nghiệp và tận tâm tại Tâm An.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {currentUser ? (
                  <Link href={currentUser.role === "DOCTOR" ? "/doctor" : "/patient"}>
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
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[400px] lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-[2rem] transform rotate-3 scale-95 opacity-20 blur-xl"></div>
                <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-[2rem] shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://picsum.photos/seed/clinic-hero/600/500"
                    alt="Bác sĩ tại phòng khám"
                    className="rounded-[1.5rem] w-full object-cover h-[350px] sm:h-[400px]"
                  />

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      99%
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium block">Khách hàng</span>
                      <span className="text-sm text-zinc-800 dark:text-zinc-200 font-bold">Hài lòng tuyệt đối</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="about" className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Tại sao nên chọn Tâm An?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Chúng tôi mang đến quy trình thăm khám thông minh, tiết kiệm thời gian tối đa và tối ưu hiệu quả điều trị.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Đặt lịch nhanh chóng</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Lựa chọn bác sĩ, chuyên khoa và khung giờ phù hợp chỉ trong 30 giây. Nhận thông báo nhắc lịch ngay lập tức.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Bác sĩ đầu ngành</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Đội ngũ bác sĩ giàu kinh nghiệm công tác tại các bệnh viện trung ương danh tiếng trực tiếp thăm khám và tư vấn.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Bảo mật thông tin</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Bảo mật tuyệt đối hồ sơ bệnh án và lịch sử thăm khám của bệnh nhân theo tiêu chuẩn của Bộ Y tế.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section id="doctors" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Đội ngũ bác sĩ chuyên khoa
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Đội ngũ y bác sĩ Tâm An luôn nỗ lực hết mình vì sức khỏe của người bệnh, tận tụy và chu đáo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="group hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
                        {SPECIALTY_LABELS[doctor.specialty]}
                      </span>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base truncate mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                        {doctor.experience} năm kinh nghiệm
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust info & CTA */}
      <section className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_60%)]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
            Chăm sóc sức khỏe chưa bao giờ dễ dàng đến thế
          </h2>
          <p className="text-emerald-100 max-w-[65ch] mx-auto text-base sm:text-lg mb-8 leading-relaxed">
            Hãy bắt đầu bảo vệ sức khỏe của bạn và người thân bằng cách đặt lịch khám trực tuyến ngay hôm nay. Chỉ với vài thao tác đơn giản, bạn sẽ tránh được hàng giờ chờ đợi.
          </p>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="font-bold text-base text-white">Tâm An Clinic</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Mang đến dịch vụ khám chữa bệnh chất lượng cao với tinh thần phục vụ chu đáo, nhiệt tình và trách nhiệm.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Thông tin liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>123 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Hotline: 1900 8198</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Thứ 2 - Chủ nhật: 07:30 - 20:00</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Liên kết nhanh</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Chuyên khoa</a></li>
                <li><a href="#doctors" className="hover:text-white transition-colors">Đội ngũ bác sĩ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span>&copy; {new Date().getFullYear()} Tâm An Clinic. Bảo lưu mọi quyền.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
