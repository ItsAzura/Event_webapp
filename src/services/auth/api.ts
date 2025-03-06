import api from '@/services/api';

export const register = async (userData: {
  userName: string;
  email: string;
  passwordHash: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Register error', error);
    throw error;
  }
};

export const login = async (userData: {
  email: string;
  passwordHash: string;
}) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response;
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error', error);
    throw error;
  }
};
