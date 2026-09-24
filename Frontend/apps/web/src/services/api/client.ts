import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lmc_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    let normalizedError: ApiError;

    if (error.response) {
      normalizedError = {
        status: error.response.status,
        message: error.response.data?.message || error.message || 'An error occurred on the server',
        code: error.response.data?.code || `HTTP_${error.response.status}`,
      };
    } else if (error.request) {
      normalizedError = {
        status: 'network',
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      normalizedError = {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }

    return Promise.reject(normalizedError);
  }
);
