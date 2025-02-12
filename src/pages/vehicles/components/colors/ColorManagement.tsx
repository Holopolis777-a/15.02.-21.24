import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CustomColor } from '../../../../types/vehicle';
import ColorEditor from './ColorEditor';

interface ColorManagementProps {
  colors: CustomColor[];
  onChange: (colors: CustomColor[]) => void;
}

const ColorManagement: React.FC<ColorManagementProps> = ({ colors, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingColor, setEditingColor] = useState<CustomColor | undefined>();
  const [error, setError] = useState<string | null>(null);

  const handleAddColor = () => {
    setEditingColor(undefined);
    setIsEditing(true);
  };

  const handleEditColor = (color: CustomColor) => {
    setEditingColor(color);
    setIsEditing(true);
  };

  const handleSaveColor = (color: CustomColor) => {
    setError(null);
    if (editingColor) {
      // Editing existing color
      onChange(colors.map(c => c.id === editingColor.id ? color : c));
    } else {
      // Adding new color
      onChange([...colors, color]);
    }
    setIsEditing(false);
  };

  const handleRemoveColor = (id: string) => {
    const colorToRemove = colors.find(c => c.id === id);
    if (colorToRemove?.isStandard && colors.length > 1) {
      setError('Die Standardfarbe kann nicht gelöscht werden, solange andere Farben existieren');
      return;
    }
    onChange(colors.filter(color => color.id !== id));
  };

  const handleToggleStandard = (id: string) => {
    onChange(colors.map(color => ({
      ...color,
      isStandard: color.id === id
    })));
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Farbverwaltung</h3>
        <button
          onClick={handleAddColor}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Farbe
        </button>
      </div>

      <div className="space-y-2">
        {colors.map(color => (
          <div
            key={color.id}
            className="flex items-center justify-between p-3 bg-white border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded border cursor-pointer"
                style={{ backgroundColor: color.code }}
                onClick={() => handleEditColor(color)}
              />
              <div>
                <p className="font-medium text-gray-900">{color.name}</p>
                <p className="text-sm text-gray-500">
                  {color.price > 0 ? `Aufpreis: ${color.price} €` : 'Ohne Aufpreis'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={color.isStandard}
                  onChange={() => handleToggleStandard(color.id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Standard</span>
              </label>
              <button
                onClick={() => handleRemoveColor(color.id)}
                className="p-1 text-gray-400 hover:text-red-500"
                disabled={color.isStandard && colors.length > 1}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <ColorEditor
          color={editingColor}
          onSave={handleSaveColor}
          onCancel={() => setIsEditing(false)}
          isNew={!editingColor}
        />
      )}
    </div>
  );
}

export default ColorManagement;