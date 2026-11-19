import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { toast } from 'react-toastify';

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
    const data = error.response?.data as {
      message?: string;
      errors?: Record<string, string[]>;
      detail?: string;
    } | undefined;

    let errorMessage = data?.message || error.message || 'An unexpected error occurred';

    // If validation errors are returned, show the first specific error message
    if (data?.errors && typeof data.errors === 'object') {
      const errorKeys = Object.keys(data.errors);
      if (errorKeys.length > 0) {
        const firstField = errorKeys[0];
        const firstMessage = data.errors[firstField]?.[0];
        if (firstMessage) {
          errorMessage = firstMessage;
        }
      }
    }

    // Do not show an error toast for silent auth verification on /auth/me when unauthenticated
    const isSilentAuthCheck = error.config?.url?.includes('/auth/me') && error.response?.status === 401;

    if (!isSilentAuthCheck) {
      toast.error(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
