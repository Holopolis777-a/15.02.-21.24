import React from 'react';
import { Vehicle } from '../types/vehicle';
import SalaryConversionVehicleCard from '../pages/vehicles/components/SalaryConversionVehicleCard';

interface SalaryConversionVehicleCarouselProps {
  vehicles: Vehicle[];
}

export const SalaryConversionVehicleCarousel: React.FC<SalaryConversionVehicleCarouselProps> = ({ vehicles }) => {
  if (!vehicles.length) return null;

  // Filter nur Fahrzeuge mit Gehaltsumwandlung
  const salaryConversionVehicles = vehicles.filter(vehicle => 
    vehicle.categories?.includes('salary')
  );

  return (
    <div className="relative py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Überschrift */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Premium E-Fahrzeuge zur Auswahl
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Wählen Sie aus einer exklusiven Auswahl modernster Elektrofahrzeuge
          </p>
        </div>

        {/* Fahrzeug-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salaryConversionVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <SalaryConversionVehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* Hinweis */}
        <div className="mt-8 text-center text-sm text-gray-500">
          * Monatliche Rate bei einer Laufzeit von 36 Monaten
        </div>
      </div>
    </div>
  );
};

export default SalaryConversionVehicleCarousel;
