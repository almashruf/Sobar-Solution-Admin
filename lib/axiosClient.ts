import axios from "axios";
import { getAuthStore } from "@/lib/store";

const API = process.env.NEXT_PUBLIC_API_URL || "";

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Get token from auth store or localStorage
  let token;
  if (typeof window !== 'undefined') {
    token = getAuthStore().token || localStorage.getItem("accessToken");
  }
  
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Cache-Control"] = "no-cache";
  }
  return config;
});

export default axiosInstance;
