import React from 'react';

interface ColorNameInputProps {
  name: string;
  onChange: (name: string) => void;
}

const ColorNameInput: React.FC<ColorNameInputProps> = ({ name, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Farbbezeichnung
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="z.B. Mysticschwarz Metallic"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};

export default ColorNameInput;