// Mock API handlers for development/testing
// In production, these would be replaced with actual API endpoints

import type { LoginCredentials, LoginResponse, RefreshTokenResponse, User } from '../types/auth';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];

// Simple JWT token generator (for demo purposes only)
const generateToken = (payload: Record<string, unknown>, expiresInMinutes = 15): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  return `${header}.${body}.mock-signature`;
};

// Decode JWT token
const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() / 1000 > (decoded.exp as number);
};

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await delay(500); // Simulate network delay

    const user = mockUsers.find((u) => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateToken({ userId: user.id, email: user.email }, 15); // 15 minutes
    const refreshToken = generateToken({ userId: user.id, type: 'refresh' }, 7 * 24 * 60); // 7 days

    return {
      accessToken,
      refreshToken,
      user,
    };
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(300);
    // In a real app, this would invalidate the token on the server
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    await delay(300);

    const decoded = decodeToken(refreshToken);
    if (!decoded || isTokenExpired(refreshToken)) {
      throw new Error('Invalid or expired refresh token');
    }

    const userId = decoded.userId as string;
    const user = mockUsers.find((u) => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = generateToken({ userId: user.id, email: user.email }, 15);
    // Optionally rotate refresh token
    const newRefreshToken = generateToken({ userId: user.id, type: 'refresh' }, 7 * 24 * 60);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  // Get current user
  getCurrentUser: async (accessToken: string): Promise<User> => {
    await delay(300);

    const decoded = decodeToken(accessToken);
    if (!decoded || isTokenExpired(accessToken)) {
      throw new Error('Invalid or expired access token');
    }

    const userId = decoded.userId as string;
    const user = mockUsers.find((u) => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};

