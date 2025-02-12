import React from 'react';

interface StandardEquipmentProps {
  equipment: string;
  onChange: (equipment: string) => void;
}

const StandardEquipment: React.FC<StandardEquipmentProps> = ({ equipment, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Serienausstattung</h3>
      <div>
        <textarea
          rows={8}
          value={equipment}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Beschreiben Sie die Serienausstattung des Fahrzeugs..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default StandardEquipment;