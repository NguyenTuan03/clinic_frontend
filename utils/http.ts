import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const apiVersion = process.env.NEXT_PUBLIC_VERSION || "api/v1";

const httpInstance = axios.create({
  baseURL: `${apiURL}/${apiVersion}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho Request: tự động đính kèm Token xác thực nếu có từ Cookie
httpInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("clinic_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi toàn cục (ví dụ: tự động logout khi token hết hạn)
httpInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        Cookies.remove("clinic_token");
        Cookies.remove("clinic_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Định nghĩa Wrapper API helper không sử dụng kiểu "any" để tuân thủ quy tắc
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpInstance.get<T>(url, config).then((res) => res.data),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    httpInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    httpInstance.put<T>(url, data, config).then((res) => res.data),

  remove: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    httpInstance.delete<T>(url, config).then((res) => res.data),
};

export default http;
