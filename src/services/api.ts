import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { parseCookies, setCookie } from 'nookies';
import https from 'https';

// Địa chỉ API
const API_URL = 'https://localhost:7198/api/v1';

// cấu hình axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bỏ qua SSL
});

//Đảm bảo rằng mọi request đều có token
api.interceptors.request.use(config => {
  const cookies = parseCookies();
  const token = cookies.accessToken;
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const cookies = parseCookies();

    // Xử lý khi token hết hạn (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token với refresh token từ cookie
        interface RefreshTokenResponse {
          accessToken: string;
        }

        const response = await api.post<RefreshTokenResponse>(
          '/auth/refresh-token',
          {
            refreshToken: cookies.refreshToken,
            userId: cookies.userId, // (Nếu cần)
          },
        );

        // Cập nhật access token mới vào cookie
        setCookie(null, 'accessToken', response.data.accessToken, {
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });

        // Cập nhật headers cho request gốc
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        // Thử lại request gốc
        return api(originalRequest);
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        console.error('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
