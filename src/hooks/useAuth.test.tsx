import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { authApi } from '../api/auth';
import { tokenStorage } from '../utils/tokenStorage';

// Mock dependencies
vi.mock('../api/auth');
vi.mock('../utils/tokenStorage');
vi.mock('../utils/tokenRefreshScheduler');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should handle login success', async () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'user', name: 'Test User' };
    const mockResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: mockUser,
    };

    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.login({ email: 'test@example.com', password: 'password' });

    await waitFor(() => {
      expect(tokenStorage.setAccessToken).toHaveBeenCalledWith('access-token');
      expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('refresh-token');
    });
  });

  it('should handle logout', async () => {
    vi.mocked(authApi.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.logout();

    await waitFor(() => {
      expect(tokenStorage.clearTokens).toHaveBeenCalled();
    });
  });

  it('should fetch current user if authenticated', async () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'user', name: 'Test User' };
    vi.mocked(tokenStorage.isAuthenticated).mockReturnValue(true);
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });
});
