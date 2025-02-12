import React from 'react';
import { useCompanies } from '../../../hooks/useCompanies';
import CompanyCard from './CompanyCard';
import { Building2 } from 'lucide-react';

const CompanyList = () => {
  const { companies, isLoading, error } = useCompanies();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-2" />
            <p>Keine Unternehmen gefunden</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export default CompanyList;