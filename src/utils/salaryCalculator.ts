// Utility functions for salary conversion calculations
export interface CalculatorInput {
  brutto: number;              // Bruttolohn
  bruttolistenpreis: number;   // Bruttolistenpreis des Fahrzeugs
  leasingrate: number;         // Monatliche Leasingrate
  steuerklasse: string;        // Steuerklasse 1-6
  kirchensteuer: string;       // Kirchensteuer in % (0 oder 9)
  stromkosten: string;         // Stromkosten (30 oder 70)
  entfernungskilometer: number; // Entfernung zur Arbeit
}

export interface CalculatorResult {
  netSalary1: number;           // Netto ohne Leasing
  netSalary2: number;           // Netto mit Leasing
  effektivkostenArbeitnehmer: number;  // Effektivkosten
  savings: number;              // Ersparnis
}

export const calculateBenefits = (input: CalculatorInput): CalculatorResult => {
  // 1. Steuersatz basierend auf Steuerklasse
  const getTaxRate = (steuerklasse: string) => {
    const rates: { [key: string]: number } = {
      '1': 0.1595,
      '2': 0.145,
      '3': 0.08,
      '4': 0.1595,
      '5': 0.22,
      '6': 0.25
    };
    return rates[steuerklasse] || 0.1595;
  };

  // 2. Berechnung ohne Leasing
  const taxRate = getTaxRate(input.steuerklasse);
  const lohnsteuer = input.brutto * taxRate;
  const kirchensteuerRate = input.kirchensteuer === 'Ja' ? 0.09 : 0;
  const kirchensteuerBetrag = kirchensteuerRate * lohnsteuer;

  // 3. Sozialversicherungsbeiträge
  const rentenversicherung = input.brutto * 0.093;
  const krankenversicherung = input.brutto * 0.08;
  const pflegeversicherung = input.brutto * 0.01875;
  const arbeitslosenversicherung = input.brutto * 0.012;

  // 4. Gesamtabzüge ohne Leasing
  const totalDeductions = lohnsteuer + kirchensteuerBetrag + 
                         rentenversicherung + krankenversicherung + 
                         pflegeversicherung + arbeitslosenversicherung;

  // 5. Netto ohne Leasing
  const netSalary1 = input.brutto - totalDeductions;

  // 6. Geldwerter Vorteil berechnen
  const geldwerterVorteilPrivat = input.bruttolistenpreis * 0.0025;
  const geldwerterVorteilFahrten = input.bruttolistenpreis * 0.000075 * input.entfernungskilometer;
  const geldwerterVorteil = geldwerterVorteilPrivat + geldwerterVorteilFahrten;

  // 7. Berechnung mit Leasing
  const bruttoAfterLeasing = input.brutto - input.leasingrate;
  const steuerBrutto = bruttoAfterLeasing + geldwerterVorteil;

  // 8. Neue Abzüge berechnen
  const lohnsteuerAfterLeasing = steuerBrutto * taxRate;
  const rentenversicherungAfterLeasing = bruttoAfterLeasing * 0.093;
  const krankenversicherungAfterLeasing = bruttoAfterLeasing * 0.08;
  const pflegeversicherungAfterLeasing = bruttoAfterLeasing * 0.01875;
  const arbeitslosenversicherungAfterLeasing = bruttoAfterLeasing * 0.012;

  const totalDeductionsAfterLeasing = lohnsteuerAfterLeasing + kirchensteuerBetrag +
    rentenversicherungAfterLeasing + krankenversicherungAfterLeasing +
    pflegeversicherungAfterLeasing + arbeitslosenversicherungAfterLeasing;

  // 9. Netto mit Leasing
  const stromkostenValue = input.stromkosten === 'Ja' ? 30 : 70;
  const netSalary2 = steuerBrutto - totalDeductionsAfterLeasing - geldwerterVorteil + 
                     stromkostenValue;

  // 10. Effektivkosten & Ersparnis
  const effektivkostenArbeitnehmer = (netSalary1 - netSalary2) - (kirchensteuerBetrag / 2) - 40;
  const savings = (input.leasingrate * 1.19) - effektivkostenArbeitnehmer;

  return {
    netSalary1,
    netSalary2,
    effektivkostenArbeitnehmer,
    savings
  };
};