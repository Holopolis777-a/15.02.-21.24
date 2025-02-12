import React from 'react';

interface StandardFeaturesProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const STANDARD_FEATURES = [
  'LED-Scheinwerfer',
  'Navigation',
  'Klimaautomatik',
  'Sitzheizung',
  'Einparkhilfe',
  'Rückfahrkamera',
  'Bluetooth',
  'DAB+ Radio',
  'Tempomat',
  'Start/Stop-Automatik'
];

const StandardFeatures: React.FC<StandardFeaturesProps> = ({ selectedFeatures, onChange }) => {
  const handleChange = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    onChange(newFeatures);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Standardausstattung</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STANDARD_FEATURES.map(feature => (
          <div key={feature} className="flex items-center">
            <input
              type="checkbox"
              id={`feature-${feature}`}
              checked={selectedFeatures.includes(feature)}
              onChange={() => handleChange(feature)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
              {feature}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardFeatures;