import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_URL || 'https://lmc-f3vq.onrender.com/api';

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
  (response) => {
    // Backend wraps all responses in { success, data, error } envelope — unwrap it
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = body.data;
    }
    return response;
  },
  (error: AxiosError<{ success?: boolean; error?: { code?: string; message?: string } }>) => {
    let normalized: ApiError;
    if (error.response) {
      const body = error.response.data;
      normalized = {
        status: error.response.status,
        message: body?.error?.message || 'Server error',
        code: body?.error?.code || `HTTP_${error.response.status}`,
      };
      if (error.response.status === 401) {
        localStorage.removeItem('lmc_rider_token');
        const pathname = window.location.pathname;
        const targetLogin = pathname.startsWith('/login/rider')
          ? '/login/rider'
          : pathname.startsWith('/rider')
          ? '/rider/login'
          : '/login/rider';
        if (window.location.pathname !== targetLogin) {
          window.location.href = targetLogin;
        }
      }
    } else if (error.request) {
      normalized = { status: 'network', message: 'Network error. Check your connection.', code: 'NETWORK_ERROR' };
    } else {
      normalized = { status: 500, message: error.message || 'Unexpected error', code: 'UNKNOWN_ERROR' };
    }
    return Promise.reject(normalized);
  }
);
