import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // Reserved for future role-based access control
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = tokenStorage.isAuthenticated();

  useEffect(() => {
    // Listen for logout events from other tabs
    const handleLogout = () => {
      window.location.href = '/login';
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, []);

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // TODO: Add role-based access control check here if needed
  // const user = useAuth().user;
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};
