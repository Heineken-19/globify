import axios from 'axios';
import { API_URL } from '../config/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 🔹 JWT Interceptor az Authorization Header-hez
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Válasz Interceptor (401 esetén Refresh Token kezelése)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`, {
            refreshToken,
          });

          localStorage.setItem("token", data.token);
          // Frissítjük a kérést az új tokennel
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest); // 🔄 Újra elküldjük az eredeti kérést
        }
      } catch (refreshError) {
        console.error("❌ Refresh token hiba:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
