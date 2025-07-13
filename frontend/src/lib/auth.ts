"use client";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import {
  registerResponseSchema,
  tokenObtainPairResponseSchema,
  tokenRefreshResponseSchema,
  userDetailResponseSchema,
} from "@/validators/auth";
import { env } from "@/env";

// --- Token Storage Helpers ---
export const getAccessToken = (): string | null =>
  localStorage.getItem("accessToken");
export const setAccessToken = (token: string): void =>
  localStorage.setItem("accessToken", token);
export const getRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken");
export const setRefreshToken = (token: string): void =>
  localStorage.setItem("refreshToken", token);
export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// --- Axios Instance ---
const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Refresh Logic ---
export const refreshAccessToken = async (): Promise<string> => {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  // Call the refresh endpoint directly (bypasses our interceptor)
  const resp = await api.post("/api/auth/refresh/", { refresh });
  const parse = tokenRefreshResponseSchema.safeParse(resp.data);

  if (!parse.success) {
    // log the mismatch so you can adjust your Zod schema
    console.error("Refresh response did not match schema:", parse.error);
    throw new Error("Unexpected refresh response shape");
  }

  setAccessToken(parse.data.access);
  return parse.data.access;
};

// --- Response Interceptor with Retry Guard ---
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    const status = error.response?.status;

    // Only try refresh once, and never on the refresh call itself
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh/")
    ) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshAccessToken();
        // Inject the new token and retry the original request
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        // true failure: clear and force login
        console.error("Refresh failed, clearing tokens:", refreshError);
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// --- API Utility Functions ---
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
  if (!parse.success) {
    throw new Error(parse.error.message);
  }
  return parse.data;
};

// Login
export const loginUser = async (username: string, password: string) => {
  const resp = await api.post("/api/auth/login/", { username, password });
  const parse = tokenObtainPairResponseSchema.safeParse(resp.data);
  if (!parse.success) {
    throw new Error(parse.error.message);
  }

  setAccessToken(parse.data.access);
  setRefreshToken(parse.data.refresh);
  return parse.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const resp = await api.get("/api/auth/me/");
  console.log(resp);
  const parse = userDetailResponseSchema.safeParse(resp.data);
  if (!parse.success) {
    throw new Error(parse.error.message);
  }
  return parse.data;
};

export default api;
