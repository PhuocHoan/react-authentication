import { apiClient } from './client';
import type { LoginCredentials, LoginResponse, RefreshTokenResponse, User } from '../types/auth';
import { mockApi } from '../mocks/handlers';
import { tokenStorage } from '../utils/tokenStorage';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

import { scheduleTokenRefresh } from '../utils/tokenRefreshScheduler';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    if (USE_MOCK_API) {
      await mockApi.logout();
      return;
    }
    await apiClient.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (USE_MOCK_API) {
      return mockApi.refreshToken(refreshToken);
    }
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK_API) {
      let accessToken = tokenStorage.getAccessToken();
      
      // If no access token, try to refresh using refresh token
      if (!accessToken) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const data = await mockApi.refreshToken(refreshToken);
            tokenStorage.setAccessToken(data.accessToken);
            accessToken = data.accessToken;
            scheduleTokenRefresh(data.accessToken);
          } catch (error) {
            tokenStorage.clearTokens();
            throw new Error('Session expired');
          }
        } else {
          throw new Error('No access token');
        }
      }
      
      return mockApi.getCurrentUser(accessToken!);
    }
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};

