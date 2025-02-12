import React from 'react';
import EmployeeList from './components/EmployeeList';

const CompanyEmployees = () => {
  return (
    <div className="flex flex-col gap-6">
      <EmployeeList />
    </div>
  );
};

export default CompanyEmployees;
