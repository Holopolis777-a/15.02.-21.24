import React from 'react';
import { useCurrentCompany } from '../../hooks/useCurrentCompany';

const CompanyLogo = ({ className = '' }: { className?: string }) => {
  const { company, loading, error } = useCurrentCompany();

  if (loading) return null;
  if (error || !company?.logoUrl) return null;

  return (
    <div className={`w-24 h-24 bg-white rounded-2xl shadow-lg p-3 flex items-center justify-center ${className}`}>
      <img
        src={company.logoUrl}
        alt={`${company.name} Logo`}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default CompanyLogo;
