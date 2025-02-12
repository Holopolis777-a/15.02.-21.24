import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  name: string;
  included: boolean;
}

interface VehicleFeaturesProps {
  features?: Feature[];
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Keine Ausstattungsdetails verfügbar
      </div>
    );
  }

  // Gruppiere Features nach included/nicht included
  const includedFeatures = features.filter(f => f.included);
  const notIncludedFeatures = features.filter(f => !f.included);

  return (
    <div className="space-y-8">
      {/* Included Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {includedFeatures.map((feature) => (
          <div 
            key={feature.name}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-sm text-gray-700 leading-5">{feature.name}</span>
          </div>
        ))}
      </div>

      {/* Not Included Features - Optional, auskommentiert */}
      {/*
      {notIncludedFeatures.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Nicht enthalten:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notIncludedFeatures.map((feature) => (
              <div 
                key={feature.name}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
              >
                <span className="text-sm text-gray-500 leading-5">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default VehicleFeatures;
