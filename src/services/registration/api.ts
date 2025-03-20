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
