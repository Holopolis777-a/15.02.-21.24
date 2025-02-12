import React from 'react';
import { Check, X } from 'lucide-react';

interface Service {
  name: string;
  vilocar: boolean;
  leasing: boolean;
  purchase: boolean;
}

const services: Service[] = [
  {
    name: 'Versicherung',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Kfz-Steuer',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Zulassung',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Schadensmanagment',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Wartung und Verschleiß',
    vilocar: true,
    leasing: true,
    purchase: false
  },
  {
    name: 'Hauptuntersuchung',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Winterreifen inkl. Einlagern und wechseln',
    vilocar: true,
    leasing: false,
    purchase: false
  },
  {
    name: 'Schutz vor Wertverlust',
    vilocar: true,
    leasing: true,
    purchase: false
  }
];

const ServiceComparison: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white rounded-xl border border-gray-200">
      <div className="grid grid-cols-4 gap-4 p-6">
        {/* Header */}
        <div className="font-medium text-gray-500">Leistungen</div>
        <div className="font-semibold text-center">VILOCAR</div>
        <div className="font-semibold text-center">Leasing</div>
        <div className="font-semibold text-center">Kauf</div>

        {/* Services */}
        {services.map((service, index) => (
          <React.Fragment key={service.name}>
            <div className={`flex items-center ${index !== services.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              {service.name}
            </div>
            <div className={`flex justify-center items-center ${index !== services.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              {service.vilocar ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className={`flex justify-center items-center ${index !== services.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              {service.leasing ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className={`flex justify-center items-center ${index !== services.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              {service.purchase ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ServiceComparison;
