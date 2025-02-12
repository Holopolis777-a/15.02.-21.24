import React from 'react';
import { Battery } from 'lucide-react';

interface RangeBadgeProps {
  range: number;
}

const RangeBadge: React.FC<RangeBadgeProps> = ({ range }) => {
  return (
    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2">
      <Battery className="w-5 h-5 text-green-600" />
      <span className="font-medium text-gray-900">
        {range} km
      </span>
    </div>
  );
};

export default RangeBadge;