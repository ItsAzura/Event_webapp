import api from '@/services/api';

export const getAllCategories = async () => {
  try {
    const response = await api.get('/Category/all');

    return response.data;
  } catch (error) {
    console.error('Get categories error', error);
    throw error;
  }
};
