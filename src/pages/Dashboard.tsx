import React from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import {
  AdminDashboard,
  EmployerDashboard,
  EmployeeDashboard,
  BrokerDashboard,
  CustomerDashboard
} from './dashboard/index';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    case 'employee_normal':
    case 'employee_salary':
      return <EmployeeDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return (
        <div className="p-6">
          <p className="text-red-500">Unbekannte Benutzerrolle</p>
        </div>
      );
  }
};

export default Dashboard;
