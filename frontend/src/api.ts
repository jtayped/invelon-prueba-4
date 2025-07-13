import axios from "axios";
import { env } from "./env";

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to attach the token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
