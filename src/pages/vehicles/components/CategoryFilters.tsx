import React from 'react';
import { VehicleCategory } from '../../../types/vehicle';
import { Car, Building2, Wallet } from 'lucide-react';

interface CategoryFiltersProps {
  selectedCategory: VehicleCategory | 'all';
  onChange: (category: VehicleCategory | 'all') => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedCategory, onChange }) => {
  const categories = [
    { id: 'all', label: 'Alle Fahrzeuge', icon: Car },
    { id: 'regular', label: 'Fahrzeuge', icon: Car },
    { id: 'company', label: 'Firmenwagen', icon: Building2 },
    { id: 'salary', label: 'Gehaltsumwandlung', icon: Wallet }
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id as VehicleCategory | 'all')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;