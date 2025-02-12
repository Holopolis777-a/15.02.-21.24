import React from 'react';
import { IncludedService } from '../../../../types/vehicle';

interface IncludedServicesProps {
  services: IncludedService[];
  onChange: (services: IncludedService[]) => void;
}

const IncludedServices: React.FC<IncludedServicesProps> = ({ services, onChange }) => {
  const handleServiceChange = (index: number, field: keyof IncludedService, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    onChange(newServices);
  };

  const addService = () => {
    onChange([
      ...services,
      { name: '', description: '', pricePerMonth: 0, isActive: true }
    ]);
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Inklusive Leistungen</h3>
        <button
          type="button"
          onClick={addService}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Leistung hinzufügen
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={service.isActive}
                  onChange={(e) => handleServiceChange(index, 'isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Aktiv</span>
              </div>
              <button
                type="button"
                onClick={() => removeService(index)}
                className="text-red-600 hover:text-red-800"
              >
                Entfernen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preis pro Monat (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={service.pricePerMonth}
                  onChange={(e) => handleServiceChange(index, 'pricePerMonth', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
              <textarea
                rows={2}
                value={service.description}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncludedServices;