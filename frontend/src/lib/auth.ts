import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import {
  registerResponseSchema,
  tokenObtainPairResponseSchema,
  tokenRefreshResponseSchema,
  userDetailResponseSchema,
} from "@/validators/auth";
import { env } from "@/env";

const isBrowser = typeof window !== "undefined";

// --- Token Storage Helpers ---
export const getAccessToken = (): string | null =>
  isBrowser ? window.localStorage.getItem("accessToken") : null;

export const setAccessToken = (token: string): void => {
  if (!isBrowser) return;
  window.localStorage.setItem("accessToken", token);
};

export const getRefreshToken = (): string | null =>
  isBrowser ? window.localStorage.getItem("refreshToken") : null;

export const setRefreshToken = (token: string): void => {
  if (!isBrowser) return;
  window.localStorage.setItem("refreshToken", token);
};

export const clearTokens = (): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
};

// --- Axios Instance ---
const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

// Only wire up interceptors in the browser
if (isBrowser) {
  // Attach access token automatically
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Refresh Logic
  const refreshAccessToken = async (): Promise<string> => {
    const refresh = getRefreshToken();
    if (!refresh) {
      throw new Error("No refresh token available");
    }

    // Call the refresh endpoint directly
    const resp = await api.post("/api/auth/refresh/", { refresh });
    const parse = tokenRefreshResponseSchema.safeParse(resp.data);
    if (!parse.success) {
      console.error("Refresh response mismatch:", parse.error);
      throw new Error("Unexpected refresh response shape");
    }
    setAccessToken(parse.data.access);
    return parse.data.access;
  };

  // Response interceptor with retry guard
  interface ReqWithRetry extends AxiosRequestConfig {
    _retry?: boolean;
  }

  api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      const original = err.config as ReqWithRetry;
      const status = err.response?.status;

      if (
        status === 401 &&
        !original._retry &&
        !original.url?.includes("/api/auth/refresh/")
      ) {
        original._retry = true;

        try {
          const newAccess = await refreshAccessToken();
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api.request(original);
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
          clearTokens();
          window.location.href = "/login";
        }
      }

      return Promise.reject(err);
    },
  );
}

// --- API Helpers ---
// Register
export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const resp = await api.post("/api/auth/register/", {
    username,
    email,
    password,
  });
  const parse = registerResponseSchema.safeParse(resp.data);
  if (!parse.success) throw new Error(parse.error.message);
  return parse.data;
};

// Login
export const loginUser = async (username: string, password: string) => {
  const resp = await api.post("/api/auth/login/", { username, password });
  const parse = tokenObtainPairResponseSchema.safeParse(resp.data);
  if (!parse.success) throw new Error(parse.error.message);

  setAccessToken(parse.data.access);
  setRefreshToken(parse.data.refresh);
  return parse.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const resp = await api.get("/api/auth/me/");
  const parse = userDetailResponseSchema.safeParse(resp.data);
  if (!parse.success) throw new Error(parse.error.message);
  return parse.data;
};

export default api;
