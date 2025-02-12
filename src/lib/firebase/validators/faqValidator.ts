import { FAQFormData } from '../../../types/faq';

export const validateFAQData = (data: FAQFormData): void => {
  // Check if data exists
  if (!data) {
    throw new Error('Keine Daten übergeben');
  }

  // Title validation
  if (!data.title?.trim()) {
    throw new Error('Titel ist erforderlich');
  }

  if (data.title.trim().length < 3) {
    throw new Error('Titel muss mindestens 3 Zeichen lang sein');
  }

  if (data.title.trim().length > 200) {
    throw new Error('Titel darf maximal 200 Zeichen lang sein');
  }

  // Content validation
  if (!data.content?.trim()) {
    throw new Error('Inhalt ist erforderlich');
  }

  // Targets validation
  if (!Array.isArray(data.targets)) {
    throw new Error('Zielgruppen müssen als Array übergeben werden');
  }

  if (data.targets.length === 0) {
    throw new Error('Mindestens eine Zielgruppe muss ausgewählt werden');
  }

  const validTargets = ['employer', 'broker', 'employee_normal', 'employee_salary', 'customer'];
  const invalidTargets = data.targets.filter(t => !validTargets.includes(t));
  
  if (invalidTargets.length > 0) {
    throw new Error(`Ungültige Zielgruppen: ${invalidTargets.join(', ')}`);
  }
};