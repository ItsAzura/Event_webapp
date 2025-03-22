import api from '@/services/api';

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get(`/User/${userId}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch profile');
    }

    return response.data;
  } catch (error) {
    console.error('Get profile error', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, data: any) => {
  try {
    const response = await api.put(`/User/${userId}`, data);

    if (response.status !== 200) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  } catch (error) {
    console.error('Update profile error', error);
    throw error;
  }
};
