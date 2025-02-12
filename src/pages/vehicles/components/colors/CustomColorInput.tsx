import React from 'react';

interface CustomColorInputProps {
  color: string;
  onChange: (color: string) => void;
}

const CustomColorInput: React.FC<CustomColorInputProps> = ({ color, onChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Individuelle Farbe (HEX)
        </label>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB"
          pattern="^#([A-Fa-f0-9]{6})$"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      {color && (
        <div 
          className="mt-6 w-10 h-10 rounded-lg border border-gray-200"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
};

export default CustomColorInput;