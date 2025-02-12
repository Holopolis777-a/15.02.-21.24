import React from 'react';
import { Vehicle, FuelType, TransmissionType, VehicleBodyType } from '../../../types/vehicle';

interface TechnicalDataProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const TechnicalData: React.FC<TechnicalDataProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    onChange({ ...data, [name]: newValue });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fahrzeugtyp */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fahrzeugtyp <span className="text-red-500">*</span>
          </label>
          <select
            name="bodyType"
            required
            value={data.bodyType || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Typ auswählen</option>
            <option value="Limousine">Limousine</option>
            <option value="Kombi">Kombi</option>
            <option value="SUV">SUV</option>
            <option value="Coupé">Coupé</option>
            <option value="Cabrio">Cabrio</option>
          </select>
        </div>

        {/* Kraftstoffart */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kraftstoffart <span className="text-red-500">*</span>
          </label>
          <select
            name="fuelType"
            required
            value={data.fuelType || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Kraftstoff auswählen</option>
            <option value="Benzin">Benzin</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Elektro">Elektro</option>
          </select>
        </div>

        {/* Getriebe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Getriebe <span className="text-red-500">*</span>
          </label>
          <select
            name="transmission"
            required
            value={data.transmission || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Getriebe auswählen</option>
            <option value="Automatik">Automatik</option>
            <option value="Manuell">Manuell</option>
          </select>
        </div>

        {/* Leistung */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Leistung (PS) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="power"
            required
            min="1"
            value={data.power || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Hubraum */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hubraum (ccm)
          </label>
          <input
            type="number"
            name="engineSize"
            min="1"
            step="1"
            value={data.engineSize || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Verbrauchsangaben */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verbrauchsangaben (WLTP)
          </label>
          <input
            type="text"
            name="consumption"
            value={data.consumption || ''}
            onChange={handleChange}
            placeholder="z.B. 6,5l/100km kombiniert"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Reichweite (nur bei Elektrofahrzeugen) */}
        {data.fuelType === 'Elektro' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reichweite (km)
            </label>
            <input
              type="number"
              name="range"
              min="1"
              max="2000"
              value={data.range || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalData;