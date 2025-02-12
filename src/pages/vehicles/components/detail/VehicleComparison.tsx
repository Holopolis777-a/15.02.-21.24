import React from 'react';
import { Check, X } from 'lucide-react';

const VehicleComparison: React.FC = () => {
  const features = [
    { name: 'Versicherung' },
    { name: 'Kfz-Steuer' },
    { name: 'Zulassung' },
    { name: 'Schadensmanagment' },
    { name: 'Wartung und Verschleiß' },
    { name: 'Hauptuntersuchung' },
    { name: 'Winterreifen inkl. Einlagern und wechseln' },
    { name: 'Schutz vor Wertverlust' }
  ];

  return (
    <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr] divide-x divide-gray-200">
        <div className="flex flex-col">
          {/* Header */}
          <div className="h-[72px]"></div>
          {/* Features */}
          {features.map((feature) => (
            <div key={feature.name} className="px-6 py-4 h-[48px] flex items-center">
              <span className="text-sm font-medium text-gray-900 leading-none">{feature.name}</span>
            </div>
          ))}
        </div>

        {/* VILOCAR Column */}
        <div className="flex flex-col bg-gray-900">
          <div className="h-[72px] flex items-center justify-center">
            <h3 className="text-xl font-bold text-white">VILOCAR</h3>
          </div>
          {features.map((_, index) => (
            <div key={index} className="px-6 py-4 h-[48px] flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          ))}
        </div>

        {/* Leasing Column */}
        <div className="flex flex-col">
          <div className="h-[72px] flex items-center justify-center">
            <h3 className="text-xl font-bold text-gray-900">Leasing</h3>
          </div>
          {features.map((_, index) => (
            <div key={index} className="px-6 py-4 h-[48px] flex items-center justify-center">
              {[4, 7].includes(index) ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Kauf Column */}
        <div className="flex flex-col">
          <div className="h-[72px] flex items-center justify-center">
            <h3 className="text-xl font-bold text-gray-900">Kauf</h3>
          </div>
          {features.map((_, index) => (
            <div key={index} className="px-6 py-4 h-[48px] flex items-center justify-center">
              <X className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleComparison;
