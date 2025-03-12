import api from '@/services/api';

export const getAllTicketsByEventAreaId = async (eventAreaId: number) => {
  try {
    const response = await api.get(`/Ticket/eventArea/${eventAreaId}`);

    return response;
  } catch (error) {
    console.error('Get all tickets by event area id error', error);
    throw error;
  }
};
