import api from '@/services/api';

export const getEvents = async (
  page: number = 1,
  pageSize: number = 10,
  categoryId?: number,
  search?: string,
) => {
  try {
    const response = await api.get('/Event', {
      params: { page, pageSize, categoryId, search },
    });

    return response.data;
  } catch (error) {
    console.error('Get events error', error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const response = await api.get(`/Event/${id}`);

    return response;
  } catch (error) {
    console.error('Get event by id error', error);
    throw error;
  }
};
