import React from 'react';
import { PriceMatrixEntry } from '../../../../types/vehicle';

interface PriceMatrixProps {
  matrix: PriceMatrixEntry[];
  onChange: (matrix: PriceMatrixEntry[]) => void;
}

const DURATIONS = [24, 36, 48];
const MILEAGES = [5000, 10000, 15000, 20000];

const PriceMatrix: React.FC<PriceMatrixProps> = ({ matrix, onChange }) => {
  const handlePriceChange = (duration: number, mileage: number, price: number) => {
    const existingIndex = matrix.findIndex(
      item => item.duration === duration && item.mileage === mileage
    );

    const newMatrix = [...matrix];
    if (existingIndex >= 0) {
      newMatrix[existingIndex] = { duration, mileage, price };
    } else {
      newMatrix.push({ duration, mileage, price });
    }

    onChange(newMatrix);
  };

  const convertToNetto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMatrix = matrix.map(entry => ({
      ...entry,
      price: Number((entry.price / 1.19).toFixed(2))
    }));
    onChange(newMatrix);
  };

  const convertToBrutto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMatrix = matrix.map(entry => ({
      ...entry,
      price: Number((entry.price * 1.19).toFixed(2))
    }));
    onChange(newMatrix);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Preismatrix</h3>
        <div className="flex gap-2">
          <button
            onClick={convertToNetto}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Netto (÷1,19)
          </button>
          <button
            onClick={convertToBrutto}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200"
          >
            Brutto (×1,19)
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laufzeit / km
              </th>
              {MILEAGES.map(mileage => (
                <th key={mileage} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {mileage.toLocaleString()} km/Jahr
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {DURATIONS.map(duration => (
              <tr key={duration}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {duration} Monate
                </td>
                {MILEAGES.map(mileage => (
                  <td key={`${duration}-${mileage}`} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={matrix.find(
                        item => item.duration === duration && item.mileage === mileage
                      )?.price || ''}
                      onChange={(e) => handlePriceChange(duration, mileage, parseFloat(e.target.value))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceMatrix;
