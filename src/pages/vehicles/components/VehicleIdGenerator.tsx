import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface VehicleIdGeneratorProps {
  value: string;
  onChange: (value: string) => void;
}

const VehicleIdGenerator: React.FC<VehicleIdGeneratorProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const generateId = () => {
    // Format: FZG-YYYY-XXXXX
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    const newId = `FZG-${year}-${random}`;
    onChange(newId);
  };

  // Generate ID only once when component mounts and no value exists
  useEffect(() => {
    if (!value) {
      generateId();
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Fahrzeug-ID <span className="text-red-500">*</span>
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        ) : (
          <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-l-md">
            {value}
          </div>
        )}
        <div className="flex">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isEditing ? 'Speichern' : 'Bearbeiten'}
          </button>
          <button
            type="button"
            onClick={generateId}
            className="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Die Fahrzeug-ID wird automatisch generiert, kann aber bei Bedarf angepasst werden.
      </p>
    </div>
  );
};

export default VehicleIdGenerator;