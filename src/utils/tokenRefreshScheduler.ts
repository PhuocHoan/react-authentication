/**
 * Token Refresh Scheduler
 * Implements silent token refresh before expiration
 */

import { tokenStorage } from './tokenStorage';
import { authApi } from '../api/auth';

// Token will be refreshed 2 minutes before expiration
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
// Access token expires in 15 minutes (from mock API)
const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
// Calculate when to refresh
const REFRESH_INTERVAL_MS = ACCESS_TOKEN_EXPIRY_MS - REFRESH_BEFORE_EXPIRY_MS; // 13 minutes

class TokenRefreshScheduler {
  private refreshTimer: number | null = null;
  private onTokenRefreshed?: (token: string) => void;
  private onRefreshFailed?: () => void;

  /**
   * Start the automatic token refresh scheduler
   */
  start(
    onTokenRefreshed?: (token: string) => void,
    onRefreshFailed?: () => void
  ): void {
    this.onTokenRefreshed = onTokenRefreshed;
    this.onRefreshFailed = onRefreshFailed;

    // Clear any existing timer
    this.stop();

    // Check if we have a refresh token
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      console.log('[TokenRefresh] No refresh token available, scheduler not started');
      return;
    }

    console.log('[TokenRefresh] Scheduler started, will refresh token in', REFRESH_INTERVAL_MS / 1000, 'seconds');

    // Schedule the first refresh
    this.scheduleRefresh();
  }

  /**
   * Stop the automatic token refresh scheduler
   */
  stop(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      console.log('[TokenRefresh] Scheduler stopped');
    }
  }

  /**
   * Schedule the next token refresh
   */
  private scheduleRefresh(): void {
    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken();
      // Schedule next refresh
      this.scheduleRefresh();
    }, REFRESH_INTERVAL_MS);
  }

  /**
   * Perform the token refresh
   */
  private async refreshToken(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      console.error('[TokenRefresh] No refresh token available');
      this.stop();
      this.onRefreshFailed?.();
      return;
    }

    try {
      console.log('[TokenRefresh] Refreshing access token silently...');
      const { accessToken } = await authApi.refreshToken(refreshToken);

      // Store new access token
      tokenStorage.setAccessToken(accessToken);

      console.log('[TokenRefresh] Access token refreshed successfully');

      // Notify callback
      this.onTokenRefreshed?.(accessToken);
    } catch (error) {
      console.error('[TokenRefresh] Failed to refresh token:', error);
      this.stop();
      this.onRefreshFailed?.();
    }
  }

  /**
   * Manually trigger a token refresh
   */
  async manualRefresh(): Promise<void> {
    await this.refreshToken();
  }
}

// Export singleton instance
export const tokenRefreshScheduler = new TokenRefreshScheduler();
