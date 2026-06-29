"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Schedule } from "@/types";
import http from "@/utils/http";

interface SchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}

// Action lấy danh sách lịch rảnh (dùng cho prefetch ở Server Component)
export async function getSchedulesServer(): Promise<Schedule[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("clinic_token")?.value;

  try {
    const response = await http.get<SchedulesResponse>("/schedules", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy lịch rảnh ở Server Side:", error);
    return [];
  }
}

// Server Action tạo lịch rảnh mới
export async function createScheduleServerAction(data: { date: string; start_time: string; end_time: string }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("clinic_token")?.value;

  try {
    const response = await http.post<ScheduleResponse, typeof data>("/schedules", data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // Ép buộc Next.js xóa cache server-side cho trang schedules
    revalidatePath("/doctor/schedules");

    return { success: true, message: response.message || "Tạo lịch rảnh thành công!" };
  } catch (error) {
    const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
    const errorMessage = axiosError.response?.data?.message || "Tạo lịch rảnh thất bại.";
    return { success: false, message: errorMessage };
  }
}

// Server Action xóa lịch rảnh
export async function deleteScheduleServerAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("clinic_token")?.value;

  try {
    const response = await http.remove<ScheduleResponse>(`/schedules/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // Ép buộc Next.js xóa cache server-side cho trang schedules
    revalidatePath("/doctor/schedules");

    return { success: true, message: response.message || "Xóa lịch rảnh thành công!" };
  } catch (error) {
    const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
    const errorMessage = axiosError.response?.data?.message || "Xóa lịch rảnh thất bại.";
    return { success: false, message: errorMessage };
  }
}
