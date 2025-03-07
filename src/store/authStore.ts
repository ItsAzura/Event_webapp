import { create } from 'zustand';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import api from '@/services/api';

// Kiểu dữ liệu của state
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, passwordHash: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeFromCookies: () => void;
}

// Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  initializeFromCookies: () => {
    const cookies = parseCookies();
    console.log('Cookies khi load app:', cookies); // 🔥 Debug
    set({
      accessToken: cookies.accessToken || null,
      refreshToken: cookies.refreshToken || null,
    });
  },

  login: async (email, passwordHash) => {
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', {
        email,
        passwordHash,
      });

      // Lưu token vào cookie
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

      // Cập nhật Zustand store
      set({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      console.log(
        'Đăng nhập thành công, accessToken:',
        response.data.accessToken,
      );
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  },

  logout: async () => {
    await api.post('/auth/logout', { refreshToken: get().refreshToken });

    // Xóa cookie và Zustand store
    destroyCookie(null, 'accessToken', { path: '/' });
    destroyCookie(null, 'refreshToken', { path: '/' });

    set({ accessToken: null, refreshToken: null });
  },
}));
