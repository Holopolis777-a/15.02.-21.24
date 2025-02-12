import React from 'react';
import { CustomColor } from '../../../../types/vehicle';
import ColorBox from './ColorBox';

interface ColorGridProps {
  colors: CustomColor[];
  selectedColor: string;
  onColorSelect: (color: CustomColor) => void;
  showAddButton?: boolean;
}

const ColorGrid: React.FC<ColorGridProps> = ({ 
  colors, 
  selectedColor, 
  onColorSelect,
  showAddButton = false // Default to false to hide the add button
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {colors.map(color => (
        <ColorBox
          key={color.id}
          color={color}
          isSelected={selectedColor === color.id}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorGrid;