import React from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleList from './components/VehicleList';
import { Building2 } from 'lucide-react';

const CompanyVehicles = () => {
  const { vehicles, isLoading, error } = useVehicles();
  const companyVehicles = vehicles.filter(v => 
    v.categories?.includes('company')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Building2 className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Firmenwagen</h1>
      </div>
      <VehicleList 
        vehicles={companyVehicles}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default CompanyVehicles;
