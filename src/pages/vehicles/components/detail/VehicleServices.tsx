import React from 'react';
import { IncludedService } from '../../../../types/vehicle';
import { Check } from 'lucide-react';

interface VehicleServicesProps {
  services: IncludedService[];
}

const VehicleServices: React.FC<VehicleServicesProps> = ({ services }) => {
  const activeServices = services.filter(service => service.isActive);

  if (activeServices.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Inklusive Leistungen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeServices.map(service => (
          <div
            key={service.name}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className="p-1 bg-green-100 rounded-full">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              )}
              {service.pricePerMonth > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {service.pricePerMonth} € / Monat
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleServices;