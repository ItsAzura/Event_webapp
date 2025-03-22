import api from '@/services/api';

export const getFeedbackByEventId = async (eventId: number) => {
  try {
    const response = await api.get(`/Feedback/event/${eventId}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch feedback');
    }

    return response.data;
  } catch (error) {
    console.error('Get feedback error', error);
    throw error;
  }
};

export const createFeedback = async (data: any) => {
  try {
    const response = await api.post('/Feedback', data);

    if (response.status !== 200) {
      throw new Error('Failed to create feedback');
    }

    return response.data;
  } catch (error) {
    console.error('Create feedback error', error);
    throw error;
  }
};

export const deleteFeedback = async (feedbackId: number) => {
  try {
    const response = await api.delete(`/Feedback/${feedbackId}`);

    if (response.status !== 200) {
      throw new Error('Failed to delete feedback');
    }

    return response.data;
  } catch (error) {
    console.error('Delete feedback error', error);
    throw error;
  }
};
