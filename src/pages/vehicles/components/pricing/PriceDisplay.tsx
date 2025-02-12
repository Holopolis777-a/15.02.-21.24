import React from 'react';

interface PriceDisplayProps {
  label: string;
  price: number;
  isTotal?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ label, price, isTotal }) => {
  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);

  return (
    <div className={`flex justify-between items-center ${isTotal ? 'text-lg font-semibold' : ''}`}>
      <span className="text-gray-700">{label}</span>
      <span className={isTotal ? 'text-blue-600' : 'text-gray-900'}>
        {formattedPrice}
      </span>
    </div>
  );
};

export default PriceDisplay;