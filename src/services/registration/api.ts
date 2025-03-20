import api from '@/services/api';

export const createRegistration = async (data: any) => {
  try {
    const response = await api.post('/Registrations', data);

    if (response.status !== 201) {
      throw new Error('Failed to create registration');
    }

    return response;
  } catch (error) {
    console.error('Create registration error', error);
    throw error;
  }
};

export const getRegistrationByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/Registrations/user/${userId}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch registrations');
    }

    return response.data;
  } catch (error) {
    console.error('Get registrations error', error);
    throw error;
  }
};
