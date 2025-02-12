import React from 'react';
import { OneTimeCost } from '../../../../types/vehicle';

interface OneTimeCostsProps {
  costs: OneTimeCost[];
  onChange: (costs: OneTimeCost[]) => void;
}

const OneTimeCosts: React.FC<OneTimeCostsProps> = ({ costs, onChange }) => {
  const handleCostChange = (index: number, field: keyof OneTimeCost, value: any) => {
    const newCosts = [...costs];
    newCosts[index] = { ...newCosts[index], [field]: value };
    onChange(newCosts);
  };

  const addCost = () => {
    onChange([
      ...costs,
      { name: '', description: '', price: 0, isInclusive: false }
    ]);
  };

  const removeCost = (index: number) => {
    onChange(costs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Einmalkosten</h3>
        <button
          type="button"
          onClick={addCost}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Kosten hinzufügen
        </button>
      </div>

      <div className="space-y-4">
        {costs.map((cost, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={cost.isInclusive}
                  onChange={(e) => handleCostChange(index, 'isInclusive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Inklusiv</span>
              </div>
              <button
                type="button"
                onClick={() => removeCost(index)}
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
                  value={cost.name}
                  onChange={(e) => handleCostChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preis (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost.price}
                  onChange={(e) => handleCostChange(index, 'price', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
              <textarea
                rows={2}
                value={cost.description}
                onChange={(e) => handleCostChange(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OneTimeCosts;