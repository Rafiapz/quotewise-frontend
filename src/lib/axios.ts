import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Log or format standard errors
    const message = (error.response?.data as { message?: string })?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
