/**
 * Axios instance with request/response interceptors
 * Automatically attaches access token and handles token refresh on 401 errors
 */

import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Queue to store failed requests during token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor - attach access token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request has already been retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      // No refresh token available, clear tokens and redirect to login
      tokenStorage.clearAllTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the access token
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken: newAccessToken } = response.data;

      // Store new access token
      tokenStorage.setAccessToken(newAccessToken);

      // Update authorization header for the original request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Process queued requests
      processQueue(null);
      isRefreshing = false;

      // Retry original request with new token
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed, clear all tokens and redirect to login
      processQueue(refreshError as AxiosError);
      isRefreshing = false;
      tokenStorage.clearAllTokens();

      // Dispatch custom event for auth context to handle
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
