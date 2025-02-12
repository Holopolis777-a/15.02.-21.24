import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { calculateBenefits, CalculatorInput, CalculatorResult } from '../utils/salaryCalculator';

export const SalaryCalculator: React.FC = () => {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [input, setInput] = useState<CalculatorInput>({
    brutto: 4000,
    bruttolistenpreis: 40000,
    leasingrate: 549,
    steuerklasse: '1',
    kirchensteuer: 'Nein',
    stromkosten: 'Ja',
    entfernungskilometer: 20
  });

  useEffect(() => {
    const results = calculateBenefits(input);
    setResult(results);
  }, [input]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Berechne jetzt den Vorteil deines Mitarbeiters</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Input Section */}
          <div>
            {/* Basiswerte Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold mb-4 text-emerald-800">Basiswerte</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Leasingrate</p>
                  <p className="text-lg font-semibold text-emerald-700">{input.leasingrate} €/Monat</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Bruttolistenpreis</p>
                  <p className="text-lg font-semibold text-emerald-700">{input.bruttolistenpreis.toLocaleString()} €</p>
                </div>
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4 text-gray-800">Mitarbeiterdaten</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bruttogehalt
                  </label>
                  <input
                    type="number"
                    value={input.brutto}
                    onChange={(e) => setInput({ ...input, brutto: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Steuerklasse
                  </label>
                  <select
                    value={input.steuerklasse}
                    onChange={(e) => setInput({ ...input, steuerklasse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['1', '2', '3', '4', '5', '6'].map(klasse => (
                      <option key={klasse} value={klasse}>Steuerklasse {klasse}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entfernung zur Arbeit (km)
                  </label>
                  <input
                    type="number"
                    value={input.entfernungskilometer}
                    onChange={(e) => setInput({ ...input, entfernungskilometer: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Results Section */}
          {result && (
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Main Cost Box */}
                <div className="col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-emerald-100 mb-2 uppercase tracking-wider">Effektivkosten</p>
                    <p className="text-5xl font-bold mb-2">{result.effektivkostenArbeitnehmer.toFixed(2)} €</p>
                    <p className="text-sm text-emerald-100">Monatliche Kosten für den Mitarbeiter</p>
                  </div>
                </div>

                {/* Additional Info Boxes */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Netto ohne Leasing</p>
                      <p className="text-xl font-semibold text-gray-900">{result.netSalary1.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Netto mit Leasing</p>
                      <p className="text-xl font-semibold text-gray-900">{result.netSalary2.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>

                {/* Savings Box */}
                <div className="col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-blue-100 mb-1 uppercase tracking-wider">Monatliche Ersparnis</p>
                    <p className="text-3xl font-bold">{result.savings.toFixed(2)} €</p>
                    <p className="text-sm text-blue-100">Gegenüber konventionellem Leasing</p>
                  </div>
                </div>
              </div>

                {/* Employer Cost Box */}
                <div className="col-span-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-4 shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300 mt-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-200 mb-1 uppercase tracking-wider">Effektivkosten Arbeitgeber</p>
                    <p className="text-3xl font-bold">0,- €</p>
                    <p className="text-sm text-gray-200">Keine zusätzlichen Kosten</p>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
