import React from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import VehicleList from './components/VehicleList';
import { Car } from 'lucide-react';

const Vehicles = () => {
  const { vehicles, isLoading, error } = useVehicles();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Car className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Fahrzeuge</h1>
      </div>
      <VehicleList 
        vehicles={vehicles}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Vehicles;