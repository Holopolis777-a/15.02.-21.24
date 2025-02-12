import React from 'react';

interface ColorPriceInputProps {
  price: number;
  onChange: (price: number) => void;
}

const ColorPriceInput: React.FC<ColorPriceInputProps> = ({ price, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Aufpreis (€)
      </label>
      <input
        type="number"
        value={price}
        onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
        min="0"
        step="0.01"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default ColorPriceInput;