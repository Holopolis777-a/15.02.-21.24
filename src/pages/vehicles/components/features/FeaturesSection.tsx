import React from 'react';
import { Vehicle } from '../../../../types/vehicle';
import StandardFeatures from './StandardFeatures';
import SonderFeatures from './SonderFeatures';
import StandardEquipment from './StandardEquipment';

interface FeaturesSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <StandardFeatures
        selectedFeatures={data.standardFeatures || []}
        onChange={(features) => onChange({ ...data, standardFeatures: features })}
      />
      
      <SonderFeatures
        features={data.additionalFeatures || []}
        onChange={(features) => onChange({ ...data, additionalFeatures: features })}
      />
      
      <StandardEquipment
        equipment={data.standardEquipment || ''}
        onChange={(equipment) => onChange({ ...data, standardEquipment: equipment })}
      />
    </div>
  );
};

export default FeaturesSection;
