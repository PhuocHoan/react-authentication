import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
}: RoleBasedRouteProps) => {
  const { user, isLoadingUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (isLoadingUser) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <>{children}</>;
};
