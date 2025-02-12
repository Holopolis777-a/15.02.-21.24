import { BrokerInviteFormData } from '../types/broker';

export interface BrokerCommissionData {
  commissionPerVehicle?: number;
  availableCommission?: number;
  parentBrokerId?: string;
  subBrokerCommissions?: Record<string, number>;
}

export const validateBrokerData = (data: BrokerInviteFormData & BrokerCommissionData): void => {
  // Validate required fields
  if (!data.fullName?.trim()) {
    throw new Error('Bitte geben Sie einen Namen ein');
  }

  if (!data.email?.trim()) {
    throw new Error('Bitte geben Sie eine E-Mail-Adresse ein');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new Error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
  }

  // Phone validation
  const phoneRegex = /^(\+49|0)[1-9](\s?\d{2,4}){1,4}$/;
  if (!phoneRegex.test(data.phone.trim())) {
    throw new Error('Bitte geben Sie eine gültige Telefonnummer ein');
  }

  // Company name validation
  if (!data.companyName?.trim()) {
    throw new Error('Bitte geben Sie einen Firmennamen ein');
  }

  // Address validation
  if (!data.address?.street?.trim()) {
    throw new Error('Bitte geben Sie eine Straße ein');
  }

  if (!data.address?.city?.trim()) {
    throw new Error('Bitte geben Sie eine Stadt ein');
  }

  const postalCodeRegex = /^\d{5}$/;
  if (!postalCodeRegex.test(data.address.postalCode.trim())) {
    throw new Error('Bitte geben Sie eine gültige Postleitzahl ein');
  }

  // Commission validation (skip detailed validation for supbrokers)
  if (data.commissionPerVehicle !== undefined) {
    if (data.commissionPerVehicle < 0) {
      throw new Error('Die Provision muss größer oder gleich 0 sein');
    }
    
    if (!Number.isInteger(data.commissionPerVehicle)) {
      throw new Error('Die Provision muss eine ganze Zahl sein');
    }

    // Set initial available commission equal to commission per vehicle for new brokers
    if (data.availableCommission === undefined) {
      data.availableCommission = data.commissionPerVehicle;
    }
  }

  // Available commission validation
  if (data.availableCommission !== undefined) {
    if (data.availableCommission < 0) {
      throw new Error('Die verfügbare Provision muss größer oder gleich 0 sein');
    }
    
    if (!Number.isInteger(data.availableCommission)) {
      throw new Error('Die verfügbare Provision muss eine ganze Zahl sein');
    }
  }

  // Sub-broker commissions validation
  if (data.subBrokerCommissions) {
    const totalAllocated = Object.values(data.subBrokerCommissions).reduce((sum, commission) => sum + commission, 0);
    
    if (data.availableCommission !== undefined && totalAllocated > data.availableCommission) {
      throw new Error('Die Summe der vergebenen Provisionen kann nicht größer sein als die verfügbare Provision');
    }

    // Always validate that individual commissions are valid numbers
    Object.entries(data.subBrokerCommissions).forEach(([brokerId, commission]) => {
      if (commission < 0) {
        throw new Error(`Die Provision für Broker ${brokerId} muss größer oder gleich 0 sein`);
      }
      if (!Number.isInteger(commission)) {
        throw new Error(`Die Provision für Broker ${brokerId} muss eine ganze Zahl sein`);
      }
    });
  }
};
