import api from '@/services/api';

export const getAllUsers = async (params: string) => {
  return await api.get(`/user?${params}`);
};

export const addUser = async (data: any) => {
  return await api.post('/user', data);
};

export const updateUser = async (id: string, data: any) => {
  return await api.put(`/user/${id}`, data);
};

export const deleteUser = async (id: string): Promise<any> => {
  return await api.delete(`/user/${id}`);
};

export const getEvents = async (params: string) => {
  return await api.get(`/event/admin?${params}`);
};

export const eventApprove = async (id: string) => {
  return await api.put(`/event/${id}/approve`);
};

export const eventReject = async (id: string) => {
  return await api.put(`/event/${id}/reject`);
};
