import React, { useState } from 'react';
import { Vehicle } from '../../../../types/vehicle';
import PriceMatrix from './PriceMatrix';
import IncludedServices from './IncludedServices';
import OneTimeCosts from './OneTimeCosts';

interface PricingSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <PriceMatrix
        matrix={data.priceMatrix || []}
        onChange={(matrix) => onChange({ ...data, priceMatrix: matrix })}
      />
      
      <IncludedServices
        services={data.includedServices || []}
        onChange={(services) => onChange({ ...data, includedServices: services })}
      />
      
      <OneTimeCosts
        costs={data.oneTimeCosts || []}
        onChange={(costs) => onChange({ ...data, oneTimeCosts: costs })}
      />
    </div>
  );
};

export default PricingSection;
