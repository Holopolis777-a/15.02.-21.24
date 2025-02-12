export const FUEL_TYPE_COLORS = {
  Elektro: {
    border: '#4CAF50',
    background: '#E8F5E9',
    text: '#1B5E20'
  },
  Benzin: {
    border: '#FF9800',
    background: '#FFF3E0',
    text: '#E65100'
  },
  Diesel: {
    border: '#1976D2',
    background: '#E3F2FD',
    text: '#0D47A1'
  },
  Hybrid: {
    border: '#00BCD4',
    background: '#E0F7FA',
    text: '#006064'
  },
  default: {
    border: '#9E9E9E',
    background: '#F5F5F5',
    text: '#212121'
  }
} as const;

export type FuelType = keyof typeof FUEL_TYPE_COLORS | string;

export const getFuelTypeColors = (fuelType: FuelType) => {
  return FUEL_TYPE_COLORS[fuelType as keyof typeof FUEL_TYPE_COLORS] || FUEL_TYPE_COLORS.default;
};
