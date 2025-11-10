/**
 * Login Page
 * Implements login form with React Hook Form validation
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuthQuery';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types/auth';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login error:', error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl bg-white p-8 shadow-xl'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900'>Welcome Back</h1>
            <p className='mt-2 text-gray-600'>Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder='you@example.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder='Enter your password'
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {loginMutation.isError && (
              <div className='rounded-lg bg-red-50 p-4'>
                <p className='text-sm text-red-800'>
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : 'Invalid email or password. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loginMutation.isPending}
              className='w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loginMutation.isPending ? (
                <span className='flex items-center justify-center'>
                  <svg
                    className='mr-2 h-5 w-5 animate-spin'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                      fill='none'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-6 rounded-lg bg-blue-50 p-4'>
            <p className='text-sm font-semibold text-blue-900'>
              Demo Credentials:
            </p>
            <div className='mt-2 space-y-1 text-sm text-blue-800'>
              <p>• admin@example.com / admin123</p>
              <p>• user@example.com / user123</p>
              <p>• demo@example.com / demo123</p>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-6 text-center text-sm text-gray-600'>
            <Link
              to='/'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
