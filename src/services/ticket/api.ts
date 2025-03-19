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

export const createTicket = async (data: {
  eventAreaID: number;
  ticketName: string;
  description: string;
  quantity: number;
  price: number;
}) => {
  try {
    const response = await api.post('/Ticket', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Create ticket error', error);
    throw error;
  }
};

export const activeTicket = async (id: number) => {
  try {
    const response = await api.put(`/Ticket/active/${id}`);

    return response;
  } catch (error) {
    console.error('Active ticket error', error);
    throw error;
  }
};

export const unactiveTicket = async (id: number) => {
  try {
    const response = await api.put(`/Ticket/unactive/${id}`);

    return response;
  } catch (error) {
    console.error('Inactive ticket error', error);
    throw error;
  }
};

export const updateTicket = async (
  data: {
    ticketName: string;
    description: string;
    quantity: number;
    price: number;
  },
  id: string,
) => {
  try {
    const response = await api.put(`/Ticket/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Update ticket error', error);
    throw error;
  }
};

export const deleteTicket = async (id: number) => {
  try {
    const response = await api.delete(`/Ticket/${id}`);

    return response;
  } catch (error) {
    console.error('Delete ticket error', error);
    throw error;
  }
};
