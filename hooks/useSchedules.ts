import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

type ScheduleResponse = {
    success: boolean,
    message: string,
    data: {
        id: number,
        user_id: number,
        date: string,
        start_time: string,
        end_time: string,
        created_at: string,
        updated_at: string
    }
}

export function useCreateSchedule() {
    const mutation = useMutation<ScheduleResponse, Error, { date: string; start_time: string; end_time: string }>({
        mutationFn: (credentials) => http.post<ScheduleResponse>("/schedules", credentials),
        onSuccess: (response) => {
            toast.success(response.message || "Thành công!");
        },
        onError: (err) => {
            const axiosError = err as { response?: { data?: { success?: boolean; message?: string } } };
            const errorMessage =
                axiosError.response?.data?.message ||
                "Thất bại. Vui lòng kiểm tra lại thông tin.";
            toast.error(errorMessage);
        },
    });
    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
}

export function useDeleteSchedule() {
    const mutation = useMutation<ScheduleResponse, Error, string>({
        mutationFn: (id: string) => http.remove<ScheduleResponse>(`/schedules/${id}`),
        onSuccess: (response) => {
            toast.success(response.message || "Thành công!");
        },
        onError: (err) => {
            const axiosError = err as { response?: { data?: { success?: boolean; message?: string } } };
            const errorMessage =
                axiosError.response?.data?.message ||
                "Thất bại. Vui lòng kiểm tra lại thông tin.";
            toast.error(errorMessage);
        },
    });
    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
}