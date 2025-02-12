import { useState } from 'react';
import { Company } from '../types/company';
import { updateCompanyData } from '../lib/firebase/services/companyService';
import { useCurrentCompany } from './useCurrentCompany';

export const useCompanyData = () => {
  const { company, loading: companyLoading } = useCurrentCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCompany = async (data: Partial<Company>) => {
    if (!company) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateCompanyData(company.id, data);
      if (!result.success) {
        throw new Error('Failed to update company data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating company data');
      return false;
    } finally {
      setLoading(false);
    }
    
    return true;
  };

  return {
    company,
    loading: loading || companyLoading,
    error,
    updateCompany,
  };
};
