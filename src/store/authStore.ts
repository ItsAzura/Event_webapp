import { create } from 'zustand';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import api from '@/services/api';

// Xác định kiểu dữ liệu
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, passwordHash: string) => Promise<void>;
  register: (userData: {
    email: string;
    passwordHash: string;
    userName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  initializeFromCookies: () => void; // Hàm khởi tạo từ cookie
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  // Khởi tạo trạng thái từ cookie khi load app
  initializeFromCookies: () => {
    const cookies = parseCookies();
    set({
      accessToken: cookies.accessToken || null,
      refreshToken: cookies.refreshToken || null,
    });
  },

  // Đăng nhập và lưu cookie
  login: async (email, passwordHash) => {
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', { email, passwordHash });

    // Set cookie với options
    setCookie(null, 'accessToken', response.data.accessToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    setCookie(null, 'refreshToken', response.data.refreshToken, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    set({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  },

  // Đăng ký
  register: async userData => {
    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', userData);
  },

  // Đăng xuất và xóa cookie
  logout: async () => {
    await api.post('/auth/logout', {
      refreshToken: get().refreshToken,
    });

    // Xóa tất cả cookie liên quan
    destroyCookie(null, 'accessToken', { path: '/' });
    destroyCookie(null, 'refreshToken', { path: '/' });
    destroyCookie(null, 'user', { path: '/' });

    set({ accessToken: null, refreshToken: null });
  },
}));
