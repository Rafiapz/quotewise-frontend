import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout to gracefully accommodate serverless & cloud cold starts
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('quotewise_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as (typeof error.config & { _retryCount?: number }) | undefined;

    // Automatically retry GET requests once on cold-start timeouts or connection drops
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
    const isNetworkError = !error.response && error.request;

    if (
      config &&
      config.method?.toLowerCase() === 'get' &&
      (!config._retryCount || config._retryCount < 1) &&
      (isTimeout || isNetworkError)
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      // Exponential short delay before retry (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return apiClient(config);
    }

    const data = error.response?.data as {
      message?: string;
      errors?: Record<string, string[]>;
      detail?: string;
    } | undefined;

    let errorMessage = data?.message;

    // Friendly message for timeouts and cold starts
    if (!errorMessage && isTimeout) {
      errorMessage =
        'The server is taking longer than expected to respond (it may be waking up from sleep). Please try again in a moment.';
    } else if (!errorMessage && isNetworkError) {
      errorMessage = 'Unable to reach the server. Please check your internet connection.';
    } else if (!errorMessage) {
      errorMessage = error.message || 'An unexpected error occurred';
    }

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
