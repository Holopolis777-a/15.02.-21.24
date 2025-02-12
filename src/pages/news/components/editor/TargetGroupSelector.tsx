import React from 'react';
import { Users } from 'lucide-react';

interface TargetGroupSelectorProps {
  selectedGroups: string[];
  onChange: (groups: string[]) => void;
}

const TARGET_GROUPS = [
  { id: 'employer', label: 'Arbeitgeber' },
  { id: 'broker', label: 'Vermittler' },
  { id: 'employee_normal', label: 'Mitarbeiter (Normal)' },
  { id: 'employee_salary', label: 'Mitarbeiter (Gehaltsumwandlung)' },
  { id: 'customer', label: 'Kunde' }
];

const TargetGroupSelector: React.FC<TargetGroupSelectorProps> = ({ selectedGroups, onChange }) => {
  const handleToggle = (groupId: string) => {
    const newGroups = selectedGroups.includes(groupId)
      ? selectedGroups.filter(id => id !== groupId)
      : [...selectedGroups, groupId];
    onChange(newGroups);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Zielgruppen <span className="text-red-500">*</span>
      </label>
      
      <div className="space-y-2">
        {TARGET_GROUPS.map(group => (
          <label key={group.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedGroups.includes(group.id)}
              onChange={() => handleToggle(group.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">{group.label}</span>
          </label>
        ))}
      </div>

      {selectedGroups.length === 0 && (
        <div className="mt-2 flex items-center text-sm text-yellow-600">
          <Users className="w-4 h-4 mr-1" />
          Bitte wählen Sie mindestens eine Zielgruppe aus
        </div>
      )}
    </div>
  );
};

export default TargetGroupSelector;