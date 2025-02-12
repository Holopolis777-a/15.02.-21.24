import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const user = useAuthStore(state => state.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/vehicles" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
