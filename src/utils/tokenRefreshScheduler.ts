import { tokenStorage } from './tokenStorage';
import { mockApi } from '../mocks/handlers';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false' && import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Schedule token refresh before expiration
// Access tokens typically expire in 15 minutes, so we refresh 2 minutes before
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes (typical access token lifetime)

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Decode JWT token to get expiration time
 */
const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
};

/**
 * Schedule token refresh before expiration
 */
export const scheduleTokenRefresh = (accessToken: string): void => {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const expiration = getTokenExpiration(accessToken);
  if (!expiration) {
    // If we can't parse expiration, refresh in 13 minutes (15 - 2)
    refreshTimer = setTimeout(refreshAccessToken, TOKEN_EXPIRY_MS - REFRESH_BEFORE_EXPIRY_MS);
    return;
  }

  const now = Date.now();
  const timeUntilExpiry = expiration - now;
  const timeUntilRefresh = timeUntilExpiry - REFRESH_BEFORE_EXPIRY_MS;

  if (timeUntilRefresh > 0) {
    refreshTimer = setTimeout(refreshAccessToken, timeUntilRefresh);
  } else {
    // Token expires soon, refresh immediately
    refreshAccessToken();
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<void> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    return;
  }

  try {
    let response;

    if (USE_MOCK_API) {
      response = await mockApi.refreshToken(refreshToken);
    } else {
      // Use fetch to avoid Axios interceptor loops
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        throw new Error('Failed to refresh token');
      }

      response = await res.json();
    }

    tokenStorage.setAccessToken(response.accessToken);

    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }

    // Schedule next refresh
    if (response.accessToken) {
      scheduleTokenRefresh(response.accessToken);
    }
  } catch (error) {
    // Refresh failed, clear tokens (interceptor will handle logout)
    console.error('Failed to refresh token:', error);
    tokenStorage.clearTokens();
  }
};

/**
 * Clear the refresh timer
 */
export const clearTokenRefresh = (): void => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

