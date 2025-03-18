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

export const createEventArea = async (data: {
  eventID: number;
  areaName: string;
  capacity: number;
}) => {
  try {
    const response = await api.post('/EventArea', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Create event area error', error);
    throw error;
  }
};

export const updateEventArea = async (
  data: {
    areaName: string;
    capacity: number;
  },
  id: string,
) => {
  try {
    const response = await api.put(`/EventArea/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Update event area error', error);
    throw error;
  }
};

export const deleteEventArea = async (id: string) => {
  try {
    const response = await api.delete(`/EventArea/${id}`);

    return response;
  } catch (error) {
    console.error('Delete event area error', error);
    throw error;
  }
};
