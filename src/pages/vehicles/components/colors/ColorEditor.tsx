import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomColor } from '../../../../types/vehicle';

interface ColorEditorProps {
  color?: CustomColor;
  onSave: (color: CustomColor) => void;
  onCancel: () => void;
  isNew?: boolean;
}

const ColorEditor: React.FC<ColorEditorProps> = ({ 
  color: initialColor,
  onSave,
  onCancel,
  isNew = false
}) => {
  const [color, setColor] = useState<CustomColor>({
    id: initialColor?.id || crypto.randomUUID(),
    name: initialColor?.name || '',
    code: initialColor?.code || '#000000',
    price: initialColor?.price || 0,
    isStandard: initialColor?.isStandard || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(color);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">
            {isNew ? 'Neue Farbe hinzufügen' : 'Farbe bearbeiten'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Farbbezeichnung
            </label>
            <input
              type="text"
              value={color.name}
              onChange={e => setColor({ ...color, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Farbcode
            </label>
            <div className="mt-1 flex space-x-3">
              <input
                type="color"
                value={color.code}
                onChange={e => setColor({ ...color, code: e.target.value })}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={color.code}
                onChange={e => setColor({ ...color, code: e.target.value })}
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aufpreis (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={color.price}
              onChange={e => setColor({ ...color, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isStandard"
              checked={color.isStandard}
              onChange={e => setColor({ ...color, isStandard: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isStandard" className="ml-2 block text-sm text-gray-700">
              Als Standardfarbe festlegen
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorEditor;