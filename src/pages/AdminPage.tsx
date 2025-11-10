/**
 * Admin Page
 * Admin-only page demonstrating role-based access control
 */

import { useAuth } from '../context/AuthContext';
import { useLogout } from '../hooks/useAuthQuery';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock admin stats
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', positive: true },
    { label: 'Active Sessions', value: '456', change: '+5%', positive: true },
    { label: 'API Requests', value: '12.5K', change: '-3%', positive: false },
    { label: 'System Health', value: '98.5%', change: '+0.5%', positive: true },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
              <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800'>
                ADMIN ONLY
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <Link
                to='/dashboard'
                className='rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-300'
              >
                Dashboard
              </Link>
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
        {/* Welcome Card */}
        <div className='mb-6 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 p-8 text-white shadow-xl'>
          <h2 className='mb-2 text-3xl font-bold'>Welcome, {user?.name}!</h2>
          <p className='text-purple-100'>
            You have full administrative access to all system features.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='rounded-xl bg-white p-6 shadow-md'>
              <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
              <div className='mt-2 flex items-baseline gap-2'>
                <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
                <span
                  className={`text-sm font-semibold ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Features */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* User Management */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                User Management
              </h3>
            </div>
            <p className='mb-4 text-gray-600'>
              Manage user accounts, roles, and permissions.
            </p>
            <button className='w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700'>
              Manage Users
            </button>
          </div>

          {/* System Settings */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                System Settings
              </h3>
            </div>
            <p className='mb-4 text-gray-600'>
              Configure system-wide settings and preferences.
            </p>
            <button className='w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700'>
              Open Settings
            </button>
          </div>

          {/* Analytics */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900'>Analytics</h3>
            </div>
            <p className='mb-4 text-gray-600'>
              View detailed analytics and reports.
            </p>
            <button className='w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700'>
              View Analytics
            </button>
          </div>

          {/* Security Logs */}
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900'>Security Logs</h3>
            </div>
            <p className='mb-4 text-gray-600'>
              Monitor security events and access logs.
            </p>
            <button className='w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700'>
              View Logs
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className='mt-6 rounded-xl bg-yellow-50 p-6'>
          <div className='flex gap-4'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600'>
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h4 className='mb-1 font-bold text-yellow-900'>
                Admin Access Features
              </h4>
              <p className='text-sm text-yellow-800'>
                This page is only accessible to users with the{' '}
                <strong>admin</strong> role. Regular users will see an access
                denied message. This demonstrates the role-based access control
                (RBAC) feature implemented in the application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
