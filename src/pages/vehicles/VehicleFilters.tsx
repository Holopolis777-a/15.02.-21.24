import React from 'react';

const VehicleFilters = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fahrzeugtyp</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="regular">Reguläre Fahrzeuge</option>
            <option value="company">Firmenwagen</option>
            <option value="salary">Gehaltsumwandlung</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Marke</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Alle Marken</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preis bis</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Maximaler Preis"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;