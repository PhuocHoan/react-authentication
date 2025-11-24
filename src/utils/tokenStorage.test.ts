import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenStorage } from './tokenStorage';

describe('tokenStorage', () => {
  beforeEach(() => {
    // Clear memory token
    tokenStorage.setAccessToken(null);
    // Clear localStorage mock
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should store and retrieve access token', () => {
    const token = 'test-access-token';
    tokenStorage.setAccessToken(token);
    expect(tokenStorage.getAccessToken()).toBe(token);
  });

  it('should store and retrieve refresh token', () => {
    const token = 'test-refresh-token';
    tokenStorage.setRefreshToken(token);
    expect(tokenStorage.getRefreshToken()).toBe(token);
    expect(localStorage.getItem('refreshToken')).toBe(token);
  });

  it('should clear tokens', () => {
    tokenStorage.setAccessToken('access');
    tokenStorage.setRefreshToken('refresh');
    
    tokenStorage.clearTokens();
    
    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('should check authentication status', () => {
    expect(tokenStorage.isAuthenticated()).toBe(false);
    
    tokenStorage.setRefreshToken('token');
    expect(tokenStorage.isAuthenticated()).toBe(true);
  });
});
