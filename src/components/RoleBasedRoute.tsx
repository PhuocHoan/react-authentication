/**
 * Role-Based Route Protection Component
 * Restricts access to routes based on user roles
 */

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleBasedRoute({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}: RoleBasedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='max-w-md rounded-xl bg-white p-8 text-center shadow-xl'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600'>
            <svg
              className='h-8 w-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            Access Denied
          </h2>
          <p className='mb-6 text-gray-600'>
            You don't have permission to access this page. This page requires{' '}
            <span className='font-semibold'>{allowedRoles.join(' or ')}</span>{' '}
            role.
          </p>
          <p className='mb-6 text-sm text-gray-500'>
            Your current role:{' '}
            <span className='font-semibold'>{user.role}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className='mr-2 rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300'
          >
            Go Back
          </button>
          <a
            href={redirectTo}
            className='rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700'
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // User has correct role - render children
  return <>{children}</>;
}
