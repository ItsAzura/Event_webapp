import axios from 'axios';
import https from 'https';

const api = axios.create({
  baseURL: 'https://localhost:7198/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bỏ qua SSL
});

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
