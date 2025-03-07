'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AuthContextType } from '@/types/index';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, initializeFromCookies } = useAuthStore();

  // Khi app chạy, lấy token từ cookie
  useEffect(() => {
    initializeFromCookies();
  }, [initializeFromCookies]);

  return (
    <AuthContext.Provider value={{ accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
