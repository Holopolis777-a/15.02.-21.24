import React from 'react';
import NormalEmployeeDashboard from './NormalEmployeeDashboard';
import SalaryEmployeeDashboard from './SalaryEmployeeDashboard';
import { useAuthStore } from '../../hooks/useAuthStore';

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const isSalaryEmployee = user?.role === 'employee_salary';

  return isSalaryEmployee ? <SalaryEmployeeDashboard /> : <NormalEmployeeDashboard />;
};

export default EmployeeDashboard;
