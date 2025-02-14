import React from 'react';
import { Vehicle } from '../../../../types/vehicle';
import { Check } from 'lucide-react';

interface VehicleFeaturesProps {
  vehicle: Vehicle;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Ausstattung</h2>
      
      {/* Standard Features by Category */}
      {vehicle.standardEquipment && (
        <div className="space-y-8">
          {Object.entries(groupEquipmentByCategory(vehicle.standardEquipment)).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">{category}</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item} className="text-sm text-gray-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Features */}
      {vehicle.additionalFeatures && vehicle.additionalFeatures.length > 0 && (
        <div className="mt-8 pt-8 border-t space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Sonderausstattungen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicle.additionalFeatures.map(feature => (
              <div 
                key={feature} 
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700 leading-5">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to group equipment by category
const groupEquipmentByCategory = (equipment: string): Record<string, string[]> => {
  const categories: Record<string, string[]> = {
    'Sicherheit': [],
    'Komfort': [],
    'Multimedia': [],
    'Exterieur': [],
    'Interieur': [],
    'Serienausstattung': []
  };

  const lines = equipment.split('\n').filter(line => line.trim());
  let currentCategory = 'Serienausstattung';

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.endsWith(':')) {
      currentCategory = trimmedLine.slice(0, -1);
      if (!categories[currentCategory]) {
        categories[currentCategory] = [];
      }
    } else if (trimmedLine) {
      categories[currentCategory].push(trimmedLine);
    }
  });

  return Object.fromEntries(
    Object.entries(categories).filter(([_, items]) => items.length > 0)
  );
};

export default VehicleFeatures;
