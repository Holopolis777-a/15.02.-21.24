import { CustomColor } from '../types/vehicle';

export const validateColors = (colors: CustomColor[]) => {
  if (colors.length === 0) {
    throw new Error('Mindestens eine Farbe muss definiert sein');
  }

  const standardColors = colors.filter(c => c.isStandard);
  if (standardColors.length !== 1) {
    throw new Error('Genau eine Farbe muss als Standard markiert sein');
  }

  const names = new Set();
  for (const color of colors) {
    if (names.has(color.name)) {
      throw new Error(`Doppelte Farbbezeichnung: ${color.name}`);
    }
    names.add(color.name);

    if (color.price < 0) {
      throw new Error(`Negativer Preis nicht erlaubt für: ${color.name}`);
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(color.code)) {
      throw new Error(`Ungültiger Farbcode für ${color.name}: ${color.code}`);
    }
  }

  return true;
};