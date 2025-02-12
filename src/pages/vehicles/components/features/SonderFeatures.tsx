import React from 'react';

interface SonderFeaturesProps {
  features: string[];
  onChange: (features: string[]) => void;
}

const SonderFeatures: React.FC<SonderFeaturesProps> = ({ features, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFeatures = e.target.value.split('\n').filter(f => f.trim());
    onChange(newFeatures);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Sonderausstattungen</h3>
      <div>
        <textarea
          rows={5}
          value={features.join('\n')}
          onChange={handleChange}
          placeholder="Eine Ausstattung pro Zeile eingeben..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          Geben Sie jede Sonderausstattung in einer neuen Zeile ein
        </p>
      </div>
    </div>
  );
};

export default SonderFeatures;
