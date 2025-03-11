import axios from 'axios';
import https from 'https';
import type { AxiosRequestConfig } from 'axios'; // Import Axios types

export const getAllCategories = async () => {
  try {
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    } as AxiosRequestConfig); // Type assertion if needed (not usually required)

    const response = await axiosInstance.get(
      'https://localhost:7198/api/category/all',
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Get all categories error', error);
    throw error;
  }
};
