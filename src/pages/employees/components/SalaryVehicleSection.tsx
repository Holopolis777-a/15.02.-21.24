import React from 'react';
import { useVehicles } from '../../../hooks/useVehicles';
import VehicleList from '../../vehicles/components/VehicleList';
import SalaryConversionFooter from '../../../components/SalaryConversionFooter';

const SalaryVehicleSection = () => {
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  const salaryVehicles = vehicles.filter(v => 
    v.categories?.includes('salary')
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Gehaltsumwandlung Fahrzeuge
      </h2>
      <VehicleList 
        vehicles={salaryVehicles}
        isLoading={vehiclesLoading}
        error={vehiclesError}
      />
      <SalaryConversionFooter />
    </div>
  );
};

export default SalaryVehicleSection;
