import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface BrokerGuardProps {
  children: React.ReactNode;
}

const BrokerGuard: React.FC<BrokerGuardProps> = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'broker' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default BrokerGuard;
