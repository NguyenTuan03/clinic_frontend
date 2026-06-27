import { useMutation } from "@tanstack/react-query";
import { http } from "@/utils/http";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole, User } from "@/types";
import toast from "react-hot-toast";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    exp: number;
    user: User;
  };
}

export function useLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  const mutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: (credentials) => http.post<LoginResponse>("/auth/login", credentials),
    onSuccess: (response) => {
      const token = response.data.token;
      const loggedInUser: User & { token?: string } = {
        ...response.data.user,
        token: token
      };

      setUser(loggedInUser);
      localStorage.setItem("clinic_user", JSON.stringify(loggedInUser));

      toast.success(response.message || "Đăng nhập thành công!");

      if (loggedInUser.role === UserRole.DOCTOR) {
        router.push("/doctor");
      } else {
        router.push("/patient");
      }
    },
    onError: (err) => {
      const axiosError = err as { response?: { data?: { success?: boolean; message?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
    },
  });

  const axiosError = mutation.error as { response?: { data?: { success?: boolean; message?: string } } } | null;
  const serverErrorMessage = axiosError?.response?.data?.message || mutation.error?.message || "";

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ? serverErrorMessage : "",
  };
}
