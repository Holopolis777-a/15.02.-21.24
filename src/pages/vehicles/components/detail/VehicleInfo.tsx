import React from 'react';
import { Vehicle } from '../../../../types/vehicle';
import { Battery, Gauge, Zap, Clock, Tag } from 'lucide-react';
import { getFuelTypeColors } from '../../../../utils/fuelTypeColors';

interface VehicleInfoProps {
  vehicle: Vehicle;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicle }) => {
  const colors = getFuelTypeColors(vehicle.fuelType || '');
  const isElectric = vehicle.fuelType === 'Elektro';

  return (
    <div className="space-y-6">
      {/* Availability & Promotion */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Availability Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Verfügbarkeit</h3>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              vehicle.isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                {vehicle.isAvailable 
                  ? 'Sofort verfügbar'
                  : `Lieferzeit: ${vehicle.deliveryTime} Monate`}
              </span>
            </div>
          </div>

          {/* Promotion */}
          {vehicle.promotionText && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Aktuelle Aktion</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-${vehicle.promotionColor || 'blue'}-100 text-${vehicle.promotionColor || 'blue'}-800`}>
                <Tag className="w-4 h-4" />
                <span>{vehicle.promotionText}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Specs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Technische Daten</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Antrieb</span>
            <div className="flex items-center space-x-2">
              {isElectric ? (
                <Zap className="w-5 h-5" style={{ color: colors.border }} />
              ) : (
                <Gauge className="w-5 h-5" style={{ color: colors.border }} />
              )}
              <span className="font-medium">{vehicle.fuelType}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm text-gray-500">Leistung</span>
            <p className="font-medium">{vehicle.power} PS</p>
          </div>

          <div className="space-y-1">
            <span className="text-sm text-gray-500">Getriebe</span>
            <p className="font-medium">{vehicle.transmission}</p>
          </div>

          {isElectric && vehicle.range && (
            <div className="space-y-1">
              <span className="text-sm text-gray-500">Reichweite</span>
              <div className="flex items-center space-x-2">
                <Battery className="w-5 h-5" style={{ color: colors.border }} />
                <span className="font-medium">{vehicle.range} km</span>
              </div>
            </div>
          )}
        </div>

        {/* WLTP Values */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">WLTP-Verbrauchswerte</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicle.consumption && (
              <div className="space-y-1">
                <span className="text-sm text-gray-500">Kraftstoffverbrauch</span>
                <p className="font-medium">{vehicle.consumption}</p>
              </div>
            )}
            
            {vehicle.co2Emissions && (
              <div className="space-y-1">
                <span className="text-sm text-gray-500">CO2-Emissionen</span>
                <p className="font-medium">{vehicle.co2Emissions} g/km</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
