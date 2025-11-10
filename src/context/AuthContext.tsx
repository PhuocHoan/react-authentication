/**
 * Authentication Context
 * Manages authentication state, login, logout, and token refresh
 * Includes: Silent token refresh, multi-tab synchronization, and cookie-based storage
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, AuthContextType, LoginCredentials } from '../types/auth';
import { tokenStorage } from '../utils/tokenStorage';
import { tokenRefreshScheduler } from '../utils/tokenRefreshScheduler';
import { authApi } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          // Try to refresh access token and get user data
          const { accessToken } = await authApi.refreshToken(refreshToken);
          tokenStorage.setAccessToken(accessToken);

          // Fetch current user
          const userData = await authApi.getCurrentUser();
          setUser(userData);

          // Start silent token refresh scheduler
          tokenRefreshScheduler.start(
            (newToken) => {
              console.log(
                '[Auth] Token refreshed silently:',
                newToken.substring(0, 20) + '...',
              );
            },
            () => {
              console.error('[Auth] Silent refresh failed, logging out...');
              tokenStorage.clearAllTokens();
              setUser(null);
              navigate('/login', { replace: true });
            },
          );
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          tokenStorage.clearAllTokens();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      tokenRefreshScheduler.stop();
    };
  }, [navigate]);

  // Multi-tab synchronization - Listen for auth events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Logout event from another tab
      if (e.key === 'auth:logout') {
        console.log('[Auth] Logout detected from another tab');
        tokenRefreshScheduler.stop();
        setUser(null);
        navigate('/login', { replace: true });
      }

      // Token update event from another tab
      if (e.key === 'auth:token-update') {
        console.log('[Auth] Token update detected from another tab');
        // Optionally reload user data
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken && !user) {
          // Another tab logged in, sync the state
          authApi.refreshToken(refreshToken).then(({ accessToken }) => {
            tokenStorage.setAccessToken(accessToken);
            authApi.getCurrentUser().then((userData) => {
              setUser(userData);
              tokenRefreshScheduler.start();
            });
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, user]);

  // Listen for auth:logout event from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      tokenRefreshScheduler.stop();
      setUser(null);
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await authApi.login(credentials);

        // Store tokens
        tokenStorage.setAccessToken(response.accessToken);
        tokenStorage.setRefreshToken(response.refreshToken);

        // Set user data
        setUser(response.user);

        // Start silent token refresh scheduler
        tokenRefreshScheduler.start(
          (newToken) => {
            console.log(
              '[Auth] Token refreshed silently:',
              newToken.substring(0, 20) + '...',
            );
          },
          () => {
            console.error('[Auth] Silent refresh failed, logging out...');
            tokenStorage.clearAllTokens();
            setUser(null);
            navigate('/login', { replace: true });
          },
        );

        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        tokenStorage.clearAllTokens();
        throw error;
      }
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Stop token refresh scheduler
      tokenRefreshScheduler.stop();

      // Clear tokens and user state regardless of API call result
      tokenStorage.clearAllTokens();
      setUser(null);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { accessToken } = await authApi.refreshToken(refreshToken);
    tokenStorage.setAccessToken(accessToken);

    return accessToken;
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
