import api from '@/services/api';

export const getEventAreaById = async (id: number) => {
  try {
    const response = await api.get(`/EventArea/${id}`);

    return response;
  } catch (error) {
    console.error('Get event area by id error', error);
    throw error;
  }
};

export const getEventAreasByEventId = async (eventId: number) => {
  try {
    const response = await api.get(`/EventArea/event/${eventId}`);

    return response;
  } catch (error) {
    console.error('Get event areas by event id error', error);
    throw error;
  }
};
