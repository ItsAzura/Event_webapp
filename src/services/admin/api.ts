import api from '@/services/api';

export const getAllUsers = async (
  page: number = 1,
  pageSize: number = 10,
  roleId?: number,
  search?: string,
) => {
  try {
    const response = await api.get('/Users', {
      params: { page, pageSize, roleId, search },
    });

    return response.data;
  } catch (error) {
    console.error('Get all users error', error);
    throw error;
  }
};
