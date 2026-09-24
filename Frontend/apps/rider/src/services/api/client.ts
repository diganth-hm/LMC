import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('lmc_rider_token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    let normalized: ApiError;
    if (error.response) {
      normalized = { status: error.response.status, message: error.response.data?.message || 'Server error', code: error.response.data?.code || `HTTP_${error.response.status}` };
    } else if (error.request) {
      normalized = { status: 'network', message: 'Network error. Check your connection.', code: 'NETWORK_ERROR' };
    } else {
      normalized = { status: 500, message: error.message || 'Unexpected error', code: 'UNKNOWN_ERROR' };
    }
    return Promise.reject(normalized);
  }
);
