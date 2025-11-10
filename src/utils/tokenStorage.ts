const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_KEY = 'accessToken';

// Access token stored in memory (session only)
let accessToken: string | null = null;

// Refresh token stored in localStorage (persistent)
export const tokenStorage = {
  // Access token (memory)
  getAccessToken: (): string | null => accessToken,

  setAccessToken: (token: string | null): void => {
    accessToken = token;
  },

  // Refresh token (localStorage)
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string | null): void => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      // Broadcast to other tabs
      window.dispatchEvent(new CustomEvent('token-storage-updated', { detail: { refreshToken: token } }));
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('token-storage-updated', { detail: { refreshToken: null } }));
    }
  },

  // Clear all tokens
  clearTokens: (): void => {
    accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      // Broadcast logout to other tabs
      window.dispatchEvent(new CustomEvent('auth-logout'));
    }
  },

  // Check if user is authenticated (has refresh token)
  isAuthenticated: (): boolean => {
    return tokenStorage.getRefreshToken() !== null;
  },
};

