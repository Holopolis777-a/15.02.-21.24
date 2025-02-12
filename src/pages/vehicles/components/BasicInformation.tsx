import React from 'react';
import { Vehicle } from '../../../types/vehicle';
import VehicleIdGenerator from './VehicleIdGenerator';

interface BasicInformationProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;

    onChange({ ...data, [name]: newValue });
  };

  return (
    <div className="space-y-6">
      <VehicleIdGenerator
        value={data.id || ''}
        onChange={(id) => onChange({ ...data, id })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marke <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            required
            value={data.brand || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Modell <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            required
            value={data.model || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Baujahr <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={data.year || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Grundpreis (€)
          </label>
          <input
            type="number"
            name="basePrice"
            min="0"
            step="0.01"
            value={data.basePrice || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ausstattungsvariante
          </label>
          <input
            type="text"
            name="trimLevel"
            value={data.trimLevel || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bruttolistenpreis (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="listPrice"
            required
            min="0"
            step="0.01"
            value={data.listPrice || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fahrgestellnummer/VIN
          </label>
          <input
            type="text"
            name="vin"
            value={data.vin || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={data.isAvailable || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
            Sofort verfügbar
          </label>
        </div>

        {!data.isAvailable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lieferzeit (Monate)
            </label>
            <input
              type="number"
              name="deliveryTime"
              min="1"
              max="24"
              value={data.deliveryTime || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;