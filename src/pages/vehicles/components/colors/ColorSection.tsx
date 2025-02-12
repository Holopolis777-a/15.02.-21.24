import React, { useState } from 'react';
import { Vehicle, CustomColor } from '../../../../types/vehicle';
import ColorGrid from './ColorGrid';
import ColorManagement from './ColorManagement';
import PriceDisplay from '../pricing/PriceDisplay';

interface ColorSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const ColorSection: React.FC<ColorSectionProps> = ({ data, onChange }) => {
  const handleColorSelect = (color: CustomColor) => {
    onChange({
      ...data,
      color: color.code,
      colorName: color.name,
      colorPrice: color.price
    });
  };

  const handleCustomColorsChange = (colors: CustomColor[]) => {
    // Find the standard color
    const standardColor = colors.find(c => c.isStandard);
    
    onChange({
      ...data,
      customColors: colors,
      // Update main color if standard color changes
      ...(standardColor && {
        color: standardColor.code,
        colorName: standardColor.name,
        colorPrice: standardColor.price
      })
    });
  };

  const currentColorData = {
    name: data.colorName || '',
    code: data.color || '#FFFFFF',
    price: data.colorPrice || 0,
    isCustom: !data.color?.startsWith('#')
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Verfügbare Farben</h3>
        <ColorGrid
          colors={data.customColors || []}
          selectedColor={data.color || ''}
          onColorSelect={handleColorSelect}
        />
      </div>
      
      {currentColorData.price > 0 && (
        <div className="pt-4 border-t">
          <PriceDisplay
            label="Aufpreis für Lackierung"
            price={currentColorData.price}
          />
        </div>
      )}

      {currentColorData.code && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Vorschau</h4>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <div
              className="w-full h-full"
              style={{ backgroundColor: currentColorData.code }}
            />
          </div>
        </div>
      )}

      <div className="pt-8 border-t">
        <ColorManagement
          colors={data.customColors || []}
          onChange={handleCustomColorsChange}
        />
      </div>
    </div>
  );
}

export default ColorSection;