import React, { useState, useEffect, useCallback } from 'react';
import { Vehicle } from '../../../../types/vehicle';
import { calculateBenefits, CalculatorResult } from '../../../../utils/salaryCalculator';
import { Euro, TrendingDown, TrendingUp, Calculator } from 'lucide-react';

interface SalaryConversionCalculatorProps {
  vehicle: Vehicle;
  selectedConfig: {
    duration: number;
    mileage: number;
  };
  onConfigChange?: (config: {
    grossSalary: number;
    taxClass: string;
    churchTax: string;
    powerCosts: string;
    distance: number;
    monthlyRate: number;
    effectiveCost: number;
  }) => void;
}

const DEFAULT_RESULT: CalculatorResult = {
  netSalary1: 0,
  netSalary2: 0,
  effektivkostenArbeitnehmer: 0,
  savings: 0
};

const TAX_CLASSES = [1, 2, 3, 4, 5, 6];

const SalaryConversionCalculator: React.FC<SalaryConversionCalculatorProps> = ({
  vehicle,
  selectedConfig,
  onConfigChange
}) => {
  const [grossSalary, setGrossSalary] = useState(4000);
  const [taxClass, setTaxClass] = useState('1');
  const [churchTax, setChurchTax] = useState('Nein');
  const [powerCosts, setPowerCosts] = useState('Nein');
  const [distance, setDistance] = useState(20);
  const [result, setResult] = useState<CalculatorResult>(DEFAULT_RESULT);

  const updateCalculation = useCallback(() => {
    if (!vehicle || !selectedConfig) return;

    const monthlyRate = vehicle.priceMatrix?.find(
      p => p.duration === selectedConfig.duration && p.mileage === selectedConfig.mileage
    )?.price || 0;

    const calculationResult = calculateBenefits({
      brutto: grossSalary,
      bruttolistenpreis: vehicle.listPrice || 0,
      leasingrate: monthlyRate,
      steuerklasse: taxClass,
      kirchensteuer: churchTax,
      stromkosten: powerCosts,
      entfernungskilometer: distance
    });

    setResult(calculationResult);

    if (onConfigChange) {
      onConfigChange({
        grossSalary,
        taxClass,
        churchTax,
        powerCosts,
        distance,
        monthlyRate,
        effectiveCost: calculationResult.effektivkostenArbeitnehmer
      });
    }
  }, [
    vehicle,
    selectedConfig,
    grossSalary,
    taxClass,
    churchTax,
    powerCosts,
    distance,
    onConfigChange
  ]);

  // Run calculation whenever inputs change
  useEffect(() => {
    if (!vehicle || !selectedConfig) return;
    updateCalculation();
  }, [updateCalculation]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-white" />
          <h3 className="text-xl font-semibold text-white">Gehaltsumwandlung berechnen</h3>
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-6 space-y-6">
        {/* Gross Salary Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bruttogehalt pro Monat
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="block w-full rounded-lg border-gray-300 pl-3 pr-12 focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-lg">€</span>
            </div>
          </div>
        </div>

        {/* Tax Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Steuerklasse
          </label>
          <div className="grid grid-cols-6 gap-2">
            {TAX_CLASSES.map(cls => (
              <button
                key={cls}
                onClick={() => setTaxClass(cls.toString())}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  taxClass === cls.toString()
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Church Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kirchensteuer
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Nein', 'Ja'].map(option => (
              <button
                key={option}
                onClick={() => setChurchTax(option)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  churchTax === option
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Power Costs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Möglichkeit beim Arbeitgeber zu Laden?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Nein', 'Ja'].map(option => (
              <button
                key={option}
                onClick={() => setPowerCosts(option)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  powerCosts === option
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entfernung zur Arbeit: {distance} km
          </label>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="200"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 km</span>
              <span>100 km</span>
              <span>200 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="p-6 bg-gray-50 space-y-6">
        {/* Netto Values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Netto ohne Leasing</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold">
              {result.netSalary1.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} €
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Netto mit Leasing</span>
              <TrendingDown className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold">
              {result.netSalary2.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} €
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-700 font-medium">Sie sparen</span>
            <Euro className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-700">
            {result.savings.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} €
          </div>
          <p className="text-sm text-green-600 mt-1">
            Monatliche Ersparnis gegenüber Privatleasing
          </p>
        </div>
      </div>

      {/* Effektivkosten */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xl font-bold text-blue-900">Effektivkosten</h4>
              <p className="text-sm text-blue-600">Monatliche Belastung nach Steuern und Abgaben</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Euro className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-900">
            {result.effektivkostenArbeitnehmer.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} €
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryConversionCalculator;
