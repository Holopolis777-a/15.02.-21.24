import React from 'react';
import { Info } from 'lucide-react';

const SalaryConversionFooter = () => {
  return (
    <div className="mt-12 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start space-x-4 text-gray-500 text-sm">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p>
              Die dargestellten Berechnungen zur steuerlichen Ersparnis basieren auf den aktuell geltenden 
              Steuergesetzen und -richtlinien. Die tatsächliche Ersparnis kann je nach individueller 
              steuerlicher Situation variieren.
            </p>
            <p>
              Die Gehaltsumwandlung kann Auswirkungen auf gesetzliche Sozialleistungen wie Renten-, 
              Arbeitslosen- und Krankenversicherung haben. Eine individuelle Beratung durch einen 
              Steuerberater wird empfohlen.
            </p>
            <p className="text-xs">
              Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryConversionFooter;