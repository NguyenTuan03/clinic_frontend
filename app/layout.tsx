import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { AuthContextProvider } from "../context/AuthContext";
import QueryProvider from "../context/QueryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phòng khám Đa khoa Tâm An - Đặt lịch & Quản lý lịch hẹn trực tuyến",
  description: "Trang web phòng khám đa khoa hiện đại, thân thiện, đặt lịch dễ dàng và theo dõi quá trình khám bệnh chuyên nghiệp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthContextProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </AuthContextProvider>
          <Toaster position="top-right" reverseOrder={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
