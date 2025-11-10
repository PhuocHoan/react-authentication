/**
 * Authentication API functions
 * Handles login, logout, token refresh, and protected data fetching
 */

import apiClient from './client';
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  ProtectedDataResponse,
  User,
} from '../types/auth';

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get current user profile (protected endpoint)
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Get protected data (example protected endpoint)
   */
  getProtectedData: async (): Promise<ProtectedDataResponse> => {
    const response = await apiClient.get<ProtectedDataResponse>('/protected/data');
    return response.data;
  },
};
