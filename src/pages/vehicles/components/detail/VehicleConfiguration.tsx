import React from 'react';
import { Vehicle, CustomColor } from '../../../../types/vehicle';
import { EuroIcon, Check } from 'lucide-react';

interface VehicleConfigurationProps {
  vehicle: Vehicle;
  selectedConfig: {
    duration: number;
    mileage: number;
    colorId?: string;
  };
  onChange: (config: { duration: number; mileage: number; colorId?: string }) => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({
  vehicle,
  selectedConfig,
  onChange
}) => {
  const durations = [24, 36, 48];
  const mileages = [5000, 10000, 15000, 20000];

  const handleColorSelect = (color: CustomColor) => {
    onChange({ ...selectedConfig, colorId: color.id });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Color Selection */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lackierung</h3>
        <div className="grid grid-cols-4 gap-6">
          {vehicle.customColors?.map(color => (
            <div key={color.id} className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleColorSelect(color)}
                className={`relative w-16 h-16 rounded-full transition-all ${
                  selectedConfig.colorId === color.id
                    ? 'ring-4 ring-blue-500 ring-offset-4'
                    : 'ring-2 ring-gray-200 hover:ring-blue-200'
                }`}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: color.code }}
                />
                {selectedConfig.colorId === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1">
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                )}
              </button>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{color.name}</div>
                {color.price > 0 && (
                  <div className="text-xs text-gray-500">+{color.price} €</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Duration Selection */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Laufzeit</h3>
        <div className="bg-blue-50/50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-2">
            {durations.map(duration => (
              <button
                key={duration}
                onClick={() => onChange({ ...selectedConfig, duration })}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  selectedConfig.duration === duration
                    ? 'bg-white border-blue-500 text-blue-700 shadow-sm'
                    : 'border-transparent hover:border-blue-300 hover:bg-white/50'
                }`}
              >
                <div className="text-lg font-medium">{duration}</div>
                <div className="text-sm text-gray-600">Monate</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mileage Selection */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Laufleistung pro Jahr</h3>
        <div className="bg-blue-50/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            {mileages.map(mileage => (
              <button
                key={mileage}
                onClick={() => onChange({ ...selectedConfig, mileage })}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  selectedConfig.mileage === mileage
                    ? 'bg-white border-blue-500 text-blue-700 shadow-sm'
                    : 'border-transparent hover:border-blue-300 hover:bg-white/50'
                }`}
              >
                <div className="text-lg font-medium">
                  {mileage.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">km/Jahr</div>
              </button>
            ))}
          </div>
        </div>

        {/* List Price Box */}
        <div className="mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800">
              <EuroIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Bruttolistenpreis</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {vehicle.listPrice?.toLocaleString('de-DE')} €
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleConfiguration;