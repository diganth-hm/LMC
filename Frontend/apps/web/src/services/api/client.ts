import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
  (response) => {
    // Backend wraps all responses in { success, data, error } envelope.
    // Unwrap the envelope so service functions can do res.data and get the inner payload.
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = body.data;
    }
    return response;
  },
  (error: AxiosError<{ success?: boolean; error?: { code?: string; message?: string } }>) => {
    let normalizedError: ApiError;

    if (error.response) {
      const body = error.response.data;
      normalizedError = {
        status: error.response.status,
        message: body?.error?.message || error.message || 'An error occurred on the server',
        code: body?.error?.code || `HTTP_${error.response.status}`,
      };

      // On 401, clear stored token and user and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('lmc_auth_token');
        localStorage.removeItem('lmc_auth_user');
      }
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
