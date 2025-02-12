import React from 'react';
import { FAQTarget } from '../../../../types/faq';

interface TargetSelectorProps {
  selected: FAQTarget[];
  onChange: (targets: FAQTarget[]) => void;
}

const TARGET_OPTIONS: { value: FAQTarget; label: string }[] = [
  { value: 'employer', label: 'Arbeitgeber' },
  { value: 'broker', label: 'Vermittler' },
  { value: 'employee_normal', label: 'Mitarbeiter (Normal)' },
  { value: 'employee_salary', label: 'Mitarbeiter (Gehaltsumwandlung)' },
  { value: 'customer', label: 'Kunde' }
];

const TargetSelector: React.FC<TargetSelectorProps> = ({ selected, onChange }) => {
  const handleToggle = (target: FAQTarget) => {
    const newTargets = selected.includes(target)
      ? selected.filter(t => t !== target)
      : [...selected, target];
    onChange(newTargets);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Zielgruppen <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {TARGET_OPTIONS.map(({ value, label }) => (
          <label key={value} className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => handleToggle(value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TargetSelector;