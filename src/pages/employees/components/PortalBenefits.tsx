import React from 'react';
import { Check, Users, Wallet } from 'lucide-react';

const PortalBenefits = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Mitarbeiter Portal Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mitarbeiter Portal</h2>
              <p className="text-sm text-gray-500">Vorteile und Leistungen</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 mr-2" />
                Vorteile für Sie als Arbeitgeber
              </h3>
              <ul className="space-y-2">
                {[
                  'Kein administrativer Aufwand',
                  'Einfache Bereitstellung von Benefits',
                  'Positive Arbeitgeberwahrnehmung',
                  'Flexible Gestaltungsmöglichkeiten'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 mr-2" />
                Vorteile für Ihre Mitarbeiter
              </h3>
              <ul className="space-y-2">
                {[
                  'Exklusive Sonderkonditionen',
                  'Große Fahrzeugauswahl',
                  'Einfacher digitaler Prozess',
                  'Flexible Leasing- oder Kaufoptionen'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Gehaltsumwandlungs Portal Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <div className="bg-pink-50 p-2 rounded-lg mr-4">
              <Wallet className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gehaltsumwandlungs Portal</h2>
              <p className="text-sm text-gray-500">Vorteile und Leistungen</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 mr-2" />
                Vorteile für Sie als Arbeitgeber
              </h3>
              <ul className="space-y-2">
                {[
                  'Reduzierung administrativer Aufwände',
                  'Förderung von Nachhaltigkeit',
                  'Steigerung der Arbeitgeberattraktivität',
                  'Kostenneutral für den Arbeitgeber'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 mr-2" />
                Vorteile für Ihre Mitarbeiter
              </h3>
              <ul className="space-y-2">
                {[
                  'Steuerliche Ersparnisse durch Brutto-Gehaltsumwandlung',
                  'Rundum-sorglos-Paket mit Full-Service',
                  'Attraktive Auswahl an E-Fahrzeugen',
                  'Beitrag zur Nachhaltigkeit'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalBenefits;
