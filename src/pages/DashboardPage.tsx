/**
 * Dashboard Page
 * Protected page showing user information and protected data
 */

import { useAuth } from '../context/AuthContext';
import { useLogout, useProtectedData } from '../hooks/useAuthQuery';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { data: protectedData, isLoading, isError, error } = useProtectedData();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
            <div className='flex items-center gap-4'>
              {user?.role === 'admin' && (
                <Link
                  to='/admin'
                  className='rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className='rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid gap-6 md:grid-cols-2'>
          {/* User Information Card */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              User Information
            </h2>
            {user ? (
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-lg font-semibold text-gray-900'>
                      {user.name}
                    </p>
                    <p className='text-sm text-gray-500'>{user.email}</p>
                  </div>
                </div>
                <div className='border-t pt-3'>
                  <div className='grid gap-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm font-medium text-gray-500'>
                        User ID:
                      </span>
                      <span className='text-sm font-mono text-gray-900'>
                        {user.id}
                      </span>
                    </div>
                    {user.role && (
                      <div className='flex justify-between'>
                        <span className='text-sm font-medium text-gray-500'>
                          Role:
                        </span>
                        <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800'>
                          {user.role}
                        </span>
                      </div>
                    )}
                    {user.createdAt && (
                      <div className='flex justify-between'>
                        <span className='text-sm font-medium text-gray-500'>
                          Member Since:
                        </span>
                        <span className='text-sm text-gray-900'>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className='text-gray-500'>Loading user information...</p>
            )}
          </div>

          {/* Protected Data Card */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Protected Data
            </h2>

            {isLoading && (
              <div className='flex items-center justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
              </div>
            )}

            {isError && (
              <div className='rounded-lg bg-red-50 p-4'>
                <p className='text-sm text-red-800'>
                  Failed to load protected data:{' '}
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {protectedData && (
              <div className='space-y-4'>
                <div className='rounded-lg bg-green-50 p-4'>
                  <p className='text-sm font-medium text-green-900'>
                    {protectedData.message}
                  </p>
                </div>

                {protectedData.data &&
                typeof protectedData.data === 'object' &&
                'items' in protectedData.data &&
                Array.isArray(protectedData.data.items) ? (
                  <div>
                    <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                      Data Items:
                    </h3>
                    <div className='space-y-2'>
                      {(
                        protectedData.data.items as Array<{
                          id: number;
                          name: string;
                          value: number;
                        }>
                      ).map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3'
                        >
                          <span className='text-sm font-medium text-gray-700'>
                            {item.name}
                          </span>
                          <span className='rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className='border-t pt-3 text-xs text-gray-500'>
                  Last updated:{' '}
                  {new Date(protectedData.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Authentication Status Card */}
        <div className='mt-6 rounded-xl bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            Authentication Status
          </h2>
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
            <div className='rounded-lg bg-green-50 p-4'>
              <p className='text-sm font-medium text-green-600'>Status</p>
              <p className='mt-1 text-lg font-bold text-green-900'>
                Authenticated ✓
              </p>
            </div>
            <div className='rounded-lg bg-blue-50 p-4'>
              <p className='text-sm font-medium text-blue-600'>Access Token</p>
              <p className='mt-1 text-lg font-bold text-blue-900'>
                Valid (In Memory)
              </p>
            </div>
            <div className='rounded-lg bg-purple-50 p-4'>
              <p className='text-sm font-medium text-purple-600'>
                Refresh Token
              </p>
              <p className='mt-1 text-lg font-bold text-purple-900'>
                Stored (Secure Cookie)
              </p>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className='mt-6 rounded-xl bg-blue-50 p-6'>
          <h3 className='mb-2 text-lg font-semibold text-blue-900'>
            About This Dashboard
          </h3>
          <div className='space-y-2 text-sm text-blue-800'>
            <p>
              • This is a protected route that requires authentication to
              access.
            </p>
            <p>
              • The access token is stored in memory and automatically attached
              to API requests.
            </p>
            <p>
              • The refresh token is stored in secure cookies (SameSite strict,
              secure flag).
            </p>
            <p>
              • Tokens are automatically refreshed every 13 minutes (before
              15-min expiry).
            </p>
            <p>
              • Authentication state syncs across all browser tabs in real-time.
            </p>
            <p>
              • All authentication is managed by React Query and Axios
              interceptors.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
