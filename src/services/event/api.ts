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

export const getEventByUserId = async (
  id: string,
  page: number = 1,
  pageSize: number = 10,
  categoryId?: number,
  search?: string,
) => {
  try {
    const response = await api.get(`/Event/user/${id}`, {
      params: { page, pageSize, categoryId, search },
    });

    return response.data;
  } catch (error) {
    console.error('Get event by user id error', error);
    throw error;
  }
};

export const createEvent = async (data: FormData) => {
  try {
    const response = await api.post('/Event', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    console.error('Create event error', error);
    throw error;
  }
};

export const updateEvent = async (id: number, data: FormData) => {
  try {
    return await api.put(`/Event/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error: any) {
    console.error('Update event error:', error);
    return { status: error.response?.status || 500, error };
  }
};

export const deleteEvent = async (id: number) => {
  try {
    return await api.delete(`/Event/${id}`);
  } catch (error: any) {
    console.error('Delete event error:', error);
    return { status: error.response?.status || 500, error };
  }
};
