import { useMutation } from "@tanstack/react-query";
import { http } from "@/utils/http";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import toast from "react-hot-toast";

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation<RegisterResponse, Error, { email: string; password: string; name: string }>({
    mutationFn: (credentials) => http.post<RegisterResponse>("/auth/register", credentials),
    onSuccess: (response) => {
      toast.success(response.message || "Đăng ký thành công! Hãy đăng nhập.");
      router.push("/login");
    },
    onError: (err) => {
      const axiosError = err as { response?: { data?: { success?: boolean; message?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
    },
  });

  const axiosError = mutation.error as { response?: { data?: { success?: boolean; message?: string } } } | null;
  const serverErrorMessage = axiosError?.response?.data?.message || mutation.error?.message || "";

  return {
    register: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ? serverErrorMessage : "",
  };
}
