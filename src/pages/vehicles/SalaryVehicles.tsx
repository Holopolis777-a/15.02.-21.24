import React from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleList from './components/VehicleList';
import { Wallet } from 'lucide-react';
import SalaryConversionFooter from '../../components/SalaryConversionFooter';

const SalaryVehicles = () => {
  const { vehicles, isLoading, error } = useVehicles();
  const salaryVehicles = vehicles.filter(v => 
    v.categories?.includes('salary')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Wallet className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gehaltsumwandlung</h1>
      </div>
      
      <VehicleList 
        vehicles={salaryVehicles}
        isLoading={isLoading}
        error={error}
      />

      <SalaryConversionFooter />
    </div>
  );
};

export default SalaryVehicles;