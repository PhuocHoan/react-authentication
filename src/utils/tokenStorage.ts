/**
 * Token storage utilities
 * Access token is stored in memory (never in localStorage/cookies for security)
 * Refresh token is stored in secure cookies for persistence and better security
 */

import { cookieUtils } from './cookies';

const REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // 7 days

// In-memory storage for access token (more secure than localStorage)
let accessToken: string | null = null;

export const tokenStorage = {
  // Access Token (Memory)
  getAccessToken: (): string | null => {
    return accessToken;
  },

  setAccessToken: (token: string): void => {
    accessToken = token;
  },

  clearAccessToken: (): void => {
    accessToken = null;
  },

  // Refresh Token (Secure Cookies - Better than localStorage)
  getRefreshToken: (): string | null => {
    try {
      return cookieUtils.get(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error reading refresh token from cookies:', error);
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      cookieUtils.set(REFRESH_TOKEN_KEY, token, {
        expires: REFRESH_TOKEN_EXPIRES_DAYS,
        secure: true,
        sameSite: 'strict',
      });

      // Also broadcast token change to other tabs
      window.localStorage.setItem('auth:token-update', Date.now().toString());
    } catch (error) {
      console.error('Error saving refresh token to cookies:', error);
    }
  },

  clearRefreshToken: (): void => {
    try {
      cookieUtils.delete(REFRESH_TOKEN_KEY);

      // Broadcast logout to other tabs
      window.localStorage.setItem('auth:logout', Date.now().toString());
    } catch (error) {
      console.error('Error clearing refresh token from cookies:', error);
    }
  },

  // Clear all tokens
  clearAllTokens: (): void => {
    tokenStorage.clearAccessToken();
    tokenStorage.clearRefreshToken();
  },

  // Check if user has valid tokens
  hasTokens: (): boolean => {
    return !!tokenStorage.getAccessToken() || !!tokenStorage.getRefreshToken();
  },
};
