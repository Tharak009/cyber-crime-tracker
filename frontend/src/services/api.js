import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL
});

const PUBLIC_PATH_PREFIXES = ["/auth/", "/announcements/public"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const requestUrl = config.url || "";
  const isPublicRequest = PUBLIC_PATH_PREFIXES.some((prefix) => requestUrl.startsWith(prefix));

  if (config.headers?.Authorization === undefined && token && !isPublicRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
