import type React from "react"
import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { calculateBenefits, type CalculatorInput, type CalculatorResult } from "../../utils/salaryCalculator"

export const SalaryCalculator: React.FC = () => {
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [input, setInput] = useState<CalculatorInput>({
    brutto: 4000,
    bruttolistenpreis: 40000,
    leasingrate: 549,
    steuerklasse: "1",
    kirchensteuer: "Nein",
    stromkosten: "Ja",
    entfernungskilometer: 20,
  })

  useEffect(() => {
    const results = calculateBenefits(input)
    setResult(results)
  }, [input])

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Berechne jetzt den Vorteil deines Mitarbeiters</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-gray-800">Basiswerte</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Leasingrate</p>
                  <p className="text-lg font-semibold text-blue-600">{input.leasingrate} €/Monat</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Bruttolistenpreis</p>
                  <p className="text-lg font-semibold text-blue-600">{input.bruttolistenpreis.toLocaleString()} €</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-gray-800">Mitarbeiterdaten</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bruttogehalt</label>
                  <input
                    type="number"
                    value={input.brutto}
                    onChange={(e) => setInput({ ...input, brutto: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Steuerklasse</label>
                  <select
                    value={input.steuerklasse}
                    onChange={(e) => setInput({ ...input, steuerklasse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["1", "2", "3", "4", "5", "6"].map((klasse) => (
                      <option key={klasse} value={klasse}>
                        Steuerklasse {klasse}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entfernung zur Arbeit (km)</label>
                  <input
                    type="number"
                    value={input.entfernungskilometer}
                    onChange={(e) => setInput({ ...input, entfernungskilometer: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              <div className="bg-blue-600 rounded-xl p-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-2">Effektivkosten</p>
                <p className="text-4xl font-bold mb-2">{result.effektivkostenArbeitnehmer.toFixed(2)} €</p>
                <p className="text-sm">Monatliche Kosten für den Mitarbeiter</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Netto ohne VILOCAR</p>
                  <p className="text-xl font-semibold text-gray-900">{result.netSalary1.toFixed(2)} €</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Netto mit VILOCAR</p>
                  <p className="text-xl font-semibold text-gray-900">{result.netSalary2.toFixed(2)} €</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-6 text-white">
                <p className="text-sm uppercase tracking-wider mb-2">Monatliche Ersparnis</p>
                <p className="text-3xl font-bold">{result.savings.toFixed(2)} €</p>
                <p className="text-sm">Gegenüber konventionellem Leasing</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 text-white">
                <p className="text-sm uppercase tracking-wider mb-2">Effektivkosten Arbeitgeber</p>
                <p className="text-3xl font-bold">0,- €</p>
                <p className="text-sm">Keine zusätzlichen Kosten</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalaryCalculator
