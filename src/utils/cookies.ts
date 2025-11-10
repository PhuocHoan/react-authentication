/**
 * Cookie utilities for secure token storage
 * Implements HttpOnly-like behavior on client side with secure cookie settings
 */

interface CookieOptions {
  expires?: number; // Days until expiration
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const cookieUtils = {
  /**
   * Set a cookie with secure defaults
   */
  set: (name: string, value: string, options: CookieOptions = {}): void => {
    const {
      expires = 7,
      path = '/',
      secure = window.location.protocol === 'https:',
      sameSite = 'strict',
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Set expiration
    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    // Set path
    if (path) {
      cookieString += `; path=${path}`;
    }

    // Set secure flag (HTTPS only)
    if (secure) {
      cookieString += '; secure';
    }

    // Set SameSite
    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * Get a cookie value by name
   */
  get: (name: string): string | null => {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  },

  /**
   * Delete a cookie
   */
  delete: (name: string, path: string = '/'): void => {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  },

  /**
   * Check if a cookie exists
   */
  exists: (name: string): boolean => {
    return cookieUtils.get(name) !== null;
  },
};
