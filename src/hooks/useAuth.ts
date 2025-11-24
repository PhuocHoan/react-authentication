import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { tokenStorage } from '../utils/tokenStorage';
import { scheduleTokenRefresh, clearTokenRefresh } from '../utils/tokenRefreshScheduler';
import type { LoginCredentials, LoginResponse } from '../types/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data: LoginResponse) => {
      // Store tokens
      tokenStorage.setAccessToken(data.accessToken);
      tokenStorage.setRefreshToken(data.refreshToken);

      // Schedule token refresh
      scheduleTokenRefresh(data.accessToken);

      // Set user data in query cache
      queryClient.setQueryData(['user'], data.user);

      // Navigate to dashboard
      navigate('/dashboard');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      handleLogout();
    },
    onError: () => {
      // Even if logout API fails, clear tokens locally
      handleLogout();
    },
  });

  // Get current user query
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: tokenStorage.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle logout
  const handleLogout = () => {
    // Clear tokens
    tokenStorage.clearTokens();

    // Clear refresh timer
    clearTokenRefresh();

    // Clear query cache
    queryClient.clear();

    // Navigate to login
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    user: userQuery.data,
    isLoadingUser: userQuery.isLoading,
    isAuthenticated: tokenStorage.isAuthenticated(),
    error: loginMutation.error || logoutMutation.error || userQuery.error,
  };
};

