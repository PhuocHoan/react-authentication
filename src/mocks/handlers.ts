/**
 * Mock API handlers using MSW (Mock Service Worker)
 * Simulates backend authentication endpoints for development and demo
 */

import { http, HttpResponse, delay } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '3',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    createdAt: '2025-02-01T00:00:00Z',
  },
];

// Mock token storage
const mockTokens = new Map<string, { userId: string; expiresAt: number }>();
const mockRefreshTokens = new Map<string, { userId: string; expiresAt: number }>();

// Helper to generate mock tokens
const generateToken = (userId: string, _expiresIn: number): string => {
  const token = `mock_token_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return token;
};

// Helper to generate access token (expires in 15 minutes)
const generateAccessToken = (userId: string): string => {
  const token = generateToken(userId, 15 * 60 * 1000); // 15 minutes
  mockTokens.set(token, { userId, expiresAt: Date.now() + 15 * 60 * 1000 });
  return token;
};

// Helper to generate refresh token (expires in 7 days)
const generateRefreshToken = (userId: string): string => {
  const token = generateToken(userId, 7 * 24 * 60 * 60 * 1000); // 7 days
  mockRefreshTokens.set(token, { userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return token;
};

// Helper to verify token
const verifyAccessToken = (token: string): string | null => {
  const tokenData = mockTokens.get(token);
  if (!tokenData) return null;
  if (tokenData.expiresAt < Date.now()) {
    mockTokens.delete(token);
    return null;
  }
  return tokenData.userId;
};

// Helper to verify refresh token
const verifyRefreshToken = (token: string): string | null => {
  const tokenData = mockRefreshTokens.get(token);
  if (!tokenData) return null;
  if (tokenData.expiresAt < Date.now()) {
    mockRefreshTokens.delete(token);
    return null;
  }
  return tokenData.userId;
};

// Mock handlers
export const handlers = [
  // Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    await delay(500); // Simulate network delay

    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user data and tokens (don't send password)
    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  }),

  // Refresh token
  http.post(`${API_BASE_URL}/auth/refresh`, async ({ request }) => {
    await delay(300);

    const body = await request.json() as { refreshToken: string };
    const { refreshToken } = body;

    if (!refreshToken) {
      return HttpResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const userId = verifyRefreshToken(refreshToken);

    if (!userId) {
      return HttpResponse.json(
        { message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(userId);

    return HttpResponse.json({
      accessToken: newAccessToken,
    });
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, async ({ request }) => {
    await delay(200);

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      mockTokens.delete(token);
    }

    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Get current user
  http.get(`${API_BASE_URL}/auth/me`, async ({ request }) => {
    await delay(300);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = verifyAccessToken(token);

    if (!userId) {
      return HttpResponse.json(
        { message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json(userWithoutPassword);
  }),

  // Get protected data
  http.get(`${API_BASE_URL}/protected/data`, async ({ request }) => {
    await delay(400);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = verifyAccessToken(token);

    if (!userId) {
      return HttpResponse.json(
        { message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      message: 'This is protected data',
      data: {
        userId,
        secret: 'This data requires authentication to access',
        items: [
          { id: 1, name: 'Item 1', value: 100 },
          { id: 2, name: 'Item 2', value: 200 },
          { id: 3, name: 'Item 3', value: 300 },
        ],
      },
      timestamp: new Date().toISOString(),
    });
  }),
];
