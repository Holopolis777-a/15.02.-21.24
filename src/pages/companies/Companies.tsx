import React from 'react';
import { Building2 } from 'lucide-react';
import CompanyInviteButton from './components/CompanyInviteButton';
import CompanyList from './components/CompanyList';

const Companies = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Unternehmen</h1>
        </div>
        <CompanyInviteButton />
      </div>
      
      <CompanyList />
    </div>
  );
};

export default Companies;