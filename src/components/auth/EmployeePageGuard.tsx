import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface EmployeePageGuardProps {
  children: React.ReactNode;
}

const EmployeePageGuard: React.FC<EmployeePageGuardProps> = ({ children }) => {
  const { user } = useAuthStore();

  // Debug user role
  console.log('EmployeePageGuard - Current user:', {
    email: user?.email,
    role: user?.role
  });

  // Only employer and admin can access employees page
  const canAccessEmployees = user?.role === 'employer' || user?.role === 'admin';
  
  console.log('EmployeePageGuard - Access check:', {
    role: user?.role,
    canAccess: canAccessEmployees
  });

  if (!canAccessEmployees) {
    console.log('EmployeePageGuard - Redirecting unauthorized role');
    return <Navigate to="/" replace />;
  }

  console.log('EmployeePageGuard - Allowing access');
  return <>{children}</>;
};

export default EmployeePageGuard;
