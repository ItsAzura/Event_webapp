import api from '@/services/api';
import { AddContactData, ResponseContactData } from '@/types/index';

export const getAllContacts = async () => {
  return await api.get('/contact');
};

export const createContact = async (data: AddContactData) => {
  return await api.post('/contact', data);
};

export const answerContact = async (id: string, data: ResponseContactData) => {
  return await api.post(`/contact/respond/${id}`, data);
};
