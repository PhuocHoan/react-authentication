/**
 * Home Page (Landing Page)
 * Public page with links to login and dashboard
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-900 sm:text-6xl'>
            JWT Authentication Demo
          </h1>
          <p className='mt-4 text-xl text-gray-600'>
            React Authentication with Access & Refresh Tokens
          </p>
        </div>

        {/* Status Card */}
        {isAuthenticated && user ? (
          <div className='mx-auto mt-12 max-w-2xl rounded-2xl bg-white p-8 shadow-xl'>
            <div className='flex items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600'>
                ✓
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Welcome back, {user.name}!
                </h2>
                <p className='mt-1 text-gray-600'>
                  You are currently logged in
                </p>
              </div>
            </div>
            <div className='mt-6 flex gap-4'>
              <Link
                to='/dashboard'
                className='flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700'
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className='mx-auto mt-12 max-w-2xl rounded-2xl bg-white p-8 shadow-xl'>
            <h2 className='text-center text-2xl font-bold text-gray-900'>
              Get Started
            </h2>
            <p className='mt-2 text-center text-gray-600'>
              Sign in to access your protected dashboard
            </p>
            <div className='mt-6 flex gap-4'>
              <Link
                to='/login'
                className='flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700'
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Features */}
        <div className='mt-16 grid gap-8 md:grid-cols-3'>
          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
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
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Secure Authentication
            </h3>
            <p className='mt-2 text-gray-600'>
              JWT-based authentication with access and refresh tokens for
              maximum security
            </p>
          </div>

          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600'>
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
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Auto Token Refresh
            </h3>
            <p className='mt-2 text-gray-600'>
              Silent token refresh every 13 minutes and automatic refresh on 401
              errors
            </p>
          </div>

          <div className='rounded-xl bg-white p-6 shadow-md'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600'>
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
            <h3 className='text-lg font-semibold text-gray-900'>
              Secure Cookie Storage
            </h3>
            <p className='mt-2 text-gray-600'>
              Refresh tokens stored in secure cookies with SameSite strict and
              CSRF protection
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className='mt-16 rounded-2xl bg-white p-8 shadow-xl'>
          <h2 className='text-center text-2xl font-bold text-gray-900'>
            Built With Modern Tech
          </h2>
          <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='text-center'>
              <div className='text-4xl'>⚛️</div>
              <p className='mt-2 font-semibold text-gray-900'>React 19</p>
              <p className='text-sm text-gray-600'>with React Compiler</p>
            </div>
            <div className='text-center'>
              <div className='text-4xl'>🎨</div>
              <p className='mt-2 font-semibold text-gray-900'>Tailwind CSS 4</p>
              <p className='text-sm text-gray-600'>Modern styling</p>
            </div>
            <div className='text-center'>
              <div className='text-4xl'>🔄</div>
              <p className='mt-2 font-semibold text-gray-900'>React Query</p>
              <p className='text-sm text-gray-600'>Server state management</p>
            </div>
            <div className='text-center'>
              <div className='text-4xl'>📝</div>
              <p className='mt-2 font-semibold text-gray-900'>
                React Hook Form
              </p>
              <p className='text-sm text-gray-600'>Form validation</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className='mt-16 text-center text-gray-600'>
          <p>© 2025 JWT Authentication Demo. Built for educational purposes.</p>
        </footer>
      </div>
    </div>
  );
}
