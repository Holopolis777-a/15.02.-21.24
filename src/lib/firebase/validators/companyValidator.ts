import { CompanyInviteData } from '../../../types/company';

export const validateCompanyData = (data: CompanyInviteData): void => {
  // Required fields
  if (!data.invitedBy) throw new Error('Broker ID ist erforderlich');
  if (!data.name?.trim()) throw new Error('Firmenname ist erforderlich');
  if (!data.legalForm?.trim()) throw new Error('Rechtsform ist erforderlich');
  if (!data.industry?.trim()) throw new Error('Branche ist erforderlich');
  if (!data.contactPerson?.trim()) throw new Error('Ansprechpartner ist erforderlich');
  if (!data.email?.trim()) throw new Error('E-Mail ist erforderlich');
  if (!data.phone?.trim()) throw new Error('Telefonnummer ist erforderlich');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new Error('Ungültige E-Mail-Adresse');
  }

  // Phone validation
  const phoneRegex = /^(\+49|0)[1-9](\s?\d{2,4}){1,4}$/;
  if (!phoneRegex.test(data.phone.trim())) {
    throw new Error('Ungültige Telefonnummer');
  }

  // Address validation
  if (!data.address?.street?.trim()) throw new Error('Straße ist erforderlich');
  if (!data.address?.city?.trim()) throw new Error('Stadt ist erforderlich');
  if (!data.address?.postalCode?.trim()) throw new Error('PLZ ist erforderlich');

  const postalCodeRegex = /^\d{5}$/;
  if (!postalCodeRegex.test(data.address.postalCode.trim())) {
    throw new Error('Ungültige PLZ');
  }

  // Employee count validation
  if (data.employeeCount) {
    const employeeCount = parseInt(data.employeeCount);
    if (isNaN(employeeCount) || employeeCount < 1) {
      throw new Error('Ungültige Mitarbeiteranzahl');
    }
  }
};
