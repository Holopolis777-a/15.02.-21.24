import React, { useState } from 'react';
import { ColorData, ColorOption } from './types';
import { CustomColor } from '../../../../types/vehicle';
import ColorGrid from './ColorGrid';
import ColorNameInput from './ColorNameInput';
import CustomColorInput from './CustomColorInput';
import ColorPriceInput from './ColorPriceInput';
import { standardColors } from './standardColors';

interface ColorPickerProps {
  value: ColorData;
  onChange: (color: ColorData) => void;
  customColors?: CustomColor[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, customColors = [] }) => {
  const [isCustom, setIsCustom] = useState(value.isCustom || false);

  const handleStandardColorSelect = (color: ColorOption) => {
    setIsCustom(false);
    onChange({
      name: color.name,
      code: color.code,
      price: color.price,
      isCustom: false
    });
  };

  const handleCustomColorChange = (field: keyof ColorData, newValue: string | number) => {
    onChange({
      ...value,
      [field]: newValue,
      isCustom: true
    });
  };

  const allColors = [
    ...standardColors,
    ...customColors.map(c => ({
      name: c.name,
      code: c.code,
      price: c.price
    }))
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Verfügbare Farben</h3>
        <ColorGrid
          colors={allColors}
          selectedColor={!isCustom ? value.code : ''}
          onColorSelect={handleStandardColorSelect}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-grow border-t border-gray-200" />
        <span className="text-sm text-gray-500">oder</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <div>
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => setIsCustom(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Individuelle Farbe definieren
          </span>
        </label>

        {isCustom && (
          <div className="space-y-4">
            <ColorNameInput
              name={value.name}
              onChange={(name) => handleCustomColorChange('name', name)}
            />
            <CustomColorInput
              color={value.code}
              onChange={(code) => handleCustomColorChange('code', code)}
            />
            <ColorPriceInput
              price={value.price}
              onChange={(price) => handleCustomColorChange('price', price)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;