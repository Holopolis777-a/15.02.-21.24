import React from 'react';
import { DollarSign } from 'lucide-react';

const Commissions = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Provisionen</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-2" />
            <p>Provisionsübersicht wird geladen...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commissions;