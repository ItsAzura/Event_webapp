import api from '@/services/api';

export const image = async (imageName: string) => {
  try {
    const response = await api.get(`events/images/${imageName}`);
    return response;
  } catch (error) {
    console.error('Image error', error);
    throw error;
  }
};
