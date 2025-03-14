import api from '@/services/api';

export const getAllContacts = async () => {
  return await api.get('/contact');
};

export const createContact = async (data: any) => {
  return await api.post('/contact', data);
};

export const answerContact = async (id: string, data: any) => {
  return await api.post(`/contact/respond/${id}`, data);
};
