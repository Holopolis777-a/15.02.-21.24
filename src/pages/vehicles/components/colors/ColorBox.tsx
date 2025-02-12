import React from 'react';
import { Check } from 'lucide-react';
import { CustomColor } from '../../../../types/vehicle';

interface ColorBoxProps {
  color: CustomColor;
  isSelected: boolean;
  onClick: () => void;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-lg transition-all overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2' 
          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
      }`}
    >
      {/* Color Preview */}
      <div 
        className="aspect-[3/2] w-full"
        style={{ backgroundColor: color.code }}
      />
      
      {/* Color Info */}
      <div className="p-3 bg-white border-t">
        <div className="text-sm font-medium text-gray-900">{color.name}</div>
        <div className="text-sm text-gray-500">
          {color.price > 0 ? `+${color.price} €` : 'ohne Aufpreis'}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
          <Check className="w-4 h-4 text-blue-500" />
        </div>
      )}
    </button>
  );
};

export default ColorBox;