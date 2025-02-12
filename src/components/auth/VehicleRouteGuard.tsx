import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ProfileIncompleteNotification from '../ProfileIncompleteNotification';

interface VehicleRouteGuardProps {
  children: React.ReactNode;
}

const VehicleRouteGuard: React.FC<VehicleRouteGuardProps> = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);

  // Get current page type
  const isCompanyVehiclesPage = location.pathname === '/vehicles/company';
  const isSalaryConversionPage = location.pathname === '/vehicles/salary';
  const isRequestPage = location.pathname === '/requests';

  // Check if profile is incomplete for employees
  if ((user?.role === 'employee_normal' || user?.role === 'employee_salary') && !user?.isProfileComplete) {
    if (isRequestPage) {
      console.log('Showing profile incomplete notification');
      return <ProfileIncompleteNotification />;
    }
  }

  // Role-based access control
  if (user?.role === 'employee_normal' || user?.role === 'customer') {
    // employee_normal and customer can only access private vehicles
    if (isCompanyVehiclesPage || isSalaryConversionPage) {
      console.log(`Redirecting ${user?.role} from restricted page`);
      return <Navigate to="/vehicles/private" replace />;
    }
  } else if (user?.role === 'employee_salary') {
    // employee_salary can access private and salary, but not company
    if (isCompanyVehiclesPage) {
      console.log('Redirecting employee_salary from company vehicles page');
      return <Navigate to="/vehicles/private" replace />;
    }
  } else if (user?.role === 'employer') {
    // employer can access all vehicle pages
    console.log('Employer accessing vehicle page:', location.pathname);
  }

  // Log access attempt
  console.log('VehicleRouteGuard - Allowing access:', {
    role: user?.role,
    path: location.pathname
  });

  return <>{children}</>;
};

export default VehicleRouteGuard;
