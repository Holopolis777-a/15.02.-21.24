import React from 'react';
import { Vehicle, OneTimeCost, PriceMatrixEntry } from '../../../../types/vehicle';
import { Info, Euro } from 'lucide-react';
import VehicleComparison from './VehicleComparison';

interface VehicleCostsProps {
  vehicle: Vehicle;
  config: {
    duration: number;
    mileage: number;
  };
  oneTimeCosts: OneTimeCost[];
}

export const getMonthlyRate = (vehicle: Vehicle, config: { duration: number; mileage: number }) => {
  const entry = vehicle.priceMatrix?.find(
    (p: PriceMatrixEntry) => p.duration === config.duration && p.mileage === config.mileage
  );
  return entry?.price || 0;
};

const VehicleCosts: React.FC<VehicleCostsProps> = ({ vehicle, config, oneTimeCosts }) => {
  const calculateMonthlyRate = () => {
    const entry = vehicle.priceMatrix?.find(
      (p: PriceMatrixEntry) => p.duration === config.duration && p.mileage === config.mileage
    );
    return entry?.price || 0;
  };

  const getTotalOneTimeCosts = () => {
    return oneTimeCosts.reduce((sum, cost) => sum + (cost.isInclusive ? 0 : cost.price || 0), 0);
  };

  const monthlyRate = calculateMonthlyRate();
  const totalOneTime = getTotalOneTimeCosts();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {/* Monthly Rate Section */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">Monatliche Rate</h3>
            <div className="mt-4 flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-blue-600 tracking-tight">
                  {monthlyRate.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} €
                </span>
                <span className="text-sm text-gray-500 mt-2">
                  {vehicle.category === 'private' ? 'inkl. MwSt.' : 'zzgl. MwSt.'}
                </span>
              </div>
              <div className="bg-blue-100 p-3 rounded-full mt-2">
                <Euro className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One-time Costs Section */}
      <div className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Einmalige Kosten gesamt
          </h3>
          
          {/* Individual Costs */}
          <div className="space-y-3">
            {oneTimeCosts.map(cost => (
              <div key={cost.name} className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="font-medium text-gray-900">
                      {cost.name}
                      {cost.isInclusive && (
                        <span className="ml-2 text-sm text-green-600 font-normal">
                          (inklusive)
                        </span>
                      )}
                    </div>
                    {cost.description && (
                      <div className="flex items-start space-x-2 text-sm text-gray-500">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{cost.description}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                      {cost.price.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} €
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total One-time Costs */}
          {totalOneTime > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-900">Gesamtbetrag</span>
                  <p className="text-sm text-gray-500">Einmalige Kosten gesamt</p>
                </div>
                <span className="text-3xl font-bold text-blue-600 whitespace-nowrap">
                  {totalOneTime.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} €
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <VehicleComparison />
    </div>
  );
};

export default VehicleCosts;
