/**
 * React Query hooks for authentication and protected data
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import type { LoginCredentials } from '../types/auth';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for login mutation
 */
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['protectedData'] });
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
}

/**
 * Hook for fetching current user data
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Hook for fetching protected data
 */
export function useProtectedData() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['protectedData'],
    queryFn: authApi.getProtectedData,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}
