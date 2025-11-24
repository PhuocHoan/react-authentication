import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { tokenStorage } from './utils/tokenStorage';
import { scheduleTokenRefresh, clearTokenRefresh } from './utils/tokenRefreshScheduler';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  // Initialize token refresh scheduler on app mount
  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      scheduleTokenRefresh(accessToken);
    }

    // Listen for token storage updates from same tab
    const handleTokenUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.refreshToken) {
        const currentAccessToken = tokenStorage.getAccessToken();
        if (currentAccessToken) {
          scheduleTokenRefresh(currentAccessToken);
        }
      }
    };

    // Listen for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'refreshToken') {
        if (event.newValue) {
          // Token updated in another tab - reload to sync state
          window.location.reload();
        } else {
          // Token removed in another tab - logout
          clearTokenRefresh();
          window.location.href = '/login';
        }
      }
    };

    window.addEventListener('token-storage-updated', handleTokenUpdate);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-logout', () => {
      clearTokenRefresh();
      window.location.href = '/login';
    });

    return () => {
      window.removeEventListener('token-storage-updated', handleTokenUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-logout', () => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
