import React from 'react';
import { Euro } from 'lucide-react';

interface PriceInputProps {
  value?: number;
  onChange: (price: number | undefined) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Preis (optional)
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Euro className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          className="block w-full pl-10 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">EUR</span>
        </div>
      </div>
    </div>
  );
};

export default PriceInput;