import React from 'react';
import { Vehicle, VehicleCategory } from '../../../../types/vehicle';

interface CategorySelectorProps {
  value: VehicleCategory[];
  onChange: (categories: VehicleCategory[]) => void;
  data: Partial<Vehicle>;
  onDataChange: (data: Partial<Vehicle>) => void;
}

const CATEGORIES: { value: VehicleCategory; label: string; description: string }[] = [
  {
    value: 'regular',
    label: 'Privatwagen',
    description: 'Fahrzeug wird in der Privatwagen-Übersicht angezeigt'
  },
  {
    value: 'company',
    label: 'Firmenwagen',
    description: 'Fahrzeug wird in der Firmenwagen-Übersicht angezeigt'
  },
  {
    value: 'salary',
    label: 'Gehaltsumwandlung',
    description: 'Fahrzeug wird in der Gehaltsumwandlungs-Übersicht angezeigt'
  }
];

const CategorySelector: React.FC<CategorySelectorProps> = ({ value = [], onChange, data, onDataChange }) => {
  const handleToggleCategory = (category: VehicleCategory) => {
    let newCategories: VehicleCategory[];
    
    if (value.includes(category)) {
      // Remove the category
      newCategories = value.filter(c => c !== category);
      
      // If removing salary category, also remove the salary conversion price
      if (category === 'salary') {
        const newData = { ...data };
        delete newData.salaryConversionPrice;
        onDataChange(newData);
      }
    } else {
      // Add the category
      newCategories = [...value, category];
    }
    
    onChange(newCategories);
  };

  const handleSalaryPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    if (!isNaN(price)) {
      onDataChange({
        ...data,
        salaryConversionPrice: price
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Anzeigebereiche</h3>
        <p className="text-sm text-gray-500 mt-1">
          Wählen Sie aus, in welchen Bereichen das Fahrzeug angezeigt werden soll.
        </p>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(category => (
          <div key={category.value} className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                type="checkbox"
                checked={value.includes(category.value)}
                onChange={() => handleToggleCategory(category.value)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                {category.label}
              </label>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional price field for salary conversion */}
      {value.includes('salary') && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            monatlich ab (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={data.salaryConversionPrice || ''}
            onChange={handleSalaryPriceChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelector;