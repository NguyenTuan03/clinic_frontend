"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types";
import http from "@/utils/http";

interface AppointmentsResponse {
    success: boolean;
    message: string;
    data: Appointment[];
}

interface AppointmentResponse {
    success: boolean;
    message: string;
    data: Appointment;
}

// Lấy danh sách lịch hẹn ở Server Side (dùng cho prefetch)
export async function getAppointmentsServer(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("clinic_token")?.value;

    try {
        const response = await http.get<AppointmentsResponse>("/appointments", {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy lịch hẹn ở Server Side:", error);
        return [];
    }
}

// Server Action tạo lịch hẹn mới
export async function createAppointmentServerAction(data: { schedule_id: number }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("clinic_token")?.value;

    // Phải bọc payload trong key "appointment" để khớp với Rails backend appointment_params
    const payload = {
        appointment: {
            schedule_id: data.schedule_id,
        },
    };

    try {
        const response = await http.post<AppointmentResponse, typeof payload>("/appointments", payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        revalidatePath("/doctor/appointments");
        return { success: true, message: response.message || "Tạo lịch hẹn thành công!" };
    } catch (error) {
        const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
        const errorMessage = axiosError.response?.data?.message || "Tạo lịch hẹn thất bại.";
        return { success: false, message: errorMessage };
    }
}

// Server Action cập nhật trạng thái lịch hẹn (Xác nhận / Hủy)
export async function updateAppointmentStatusServerAction(id: number | string, status: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("clinic_token")?.value;

    const payload = {
        appointment: {
            status,
        },
    };

    try {
        const response = await http.put<AppointmentResponse, typeof payload>(`/appointments/${id}`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        revalidatePath("/doctor/appointments");
        return { success: true, message: response.message || "Cập nhật trạng thái thành công!" };
    } catch (error) {
        const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
        const errorMessage = axiosError.response?.data?.message || "Cập nhật trạng thái thất bại.";
        return { success: false, message: errorMessage };
    }
}

// Server Action xóa lịch hẹn
export async function deleteAppointmentServerAction(id: number | string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("clinic_token")?.value;

    try {
        const response = await http.remove<AppointmentResponse>(`/appointments/${id}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        revalidatePath("/doctor/appointments");
        return { success: true, message: response.message || "Xóa lịch hẹn thành công!" };
    } catch (error) {
        const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
        const errorMessage = axiosError.response?.data?.message || "Xóa lịch hẹn thất bại.";
        return { success: false, message: errorMessage };
    }
}
