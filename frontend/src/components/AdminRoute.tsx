import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface AdminRouteProps {
  children: React.ReactNode;
  requireSuperuser?: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireSuperuser = false }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has staff privileges
  if (!user.is_staff && !user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  // Check if superuser is required
  if (requireSuperuser && !user.is_superuser) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 