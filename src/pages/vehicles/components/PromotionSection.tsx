import React from 'react';
import { Vehicle } from '../../../types/vehicle';

interface PromotionSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const PromotionSection: React.FC<PromotionSectionProps> = ({ data, onChange }) => {
  const colorOptions = [
    { label: 'Blau', value: 'blue' },
    { label: 'Grün', value: 'green' },
    { label: 'Rot', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Lila', value: 'purple' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Aktionstext
        </label>
        <input
          type="text"
          name="promotionText"
          placeholder="z.B. NEUWAGEN DEAL"
          value={data.promotionText || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Farbschema
        </label>
        <select
          name="promotionColor"
          value={data.promotionColor || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Farbschema auswählen</option>
          {colorOptions.map(color => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
      </div>

      {data.promotionText && data.promotionColor && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vorschau:
          </label>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${data.promotionColor}-100 text-${data.promotionColor}-800`}>
            {data.promotionText}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionSection;