import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRoot?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRoot = false }) => {
  const { isAuthenticated, isRoot } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireRoot && !isRoot) {
    return <Navigate to="/vehicles" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;