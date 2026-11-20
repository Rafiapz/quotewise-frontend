import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth && !isAuthenticated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth && isAuthenticated) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/rfqs" replace />;
  }

  return <>{children}</>;
};
