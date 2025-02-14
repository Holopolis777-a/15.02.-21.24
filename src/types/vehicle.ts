export type FuelType = 'Benzin' | 'Diesel' | 'Hybrid' | 'Elektro';
export type TransmissionType = 'Automatik' | 'Manuell';
export type VehicleBodyType = 'Limousine' | 'Kombi' | 'SUV' | 'Coupé' | 'Cabrio';

export interface Vehicle {
  bodyType?: VehicleBodyType;
  id: string;
  brand: string;
  model: string;
  trimLevel?: string;
  color?: string;
  images?: string[];
  price?: number;
  category?: string;
  categories?: string[];
  fuelType?: FuelType;
  power?: number;
  consumption?: string;
  co2?: string;
  engineSize?: number;
  batteryCapacity?: number;
  energyConsumption?: number;
  maxACChargingPower?: number;
  maxDCChargingPower?: number;
  description?: string;
  standardFeatures?: string[];
  additionalFeatures?: string[];
  standardEquipment?: string;
  basePrice?: number;
  salaryConversionPrice?: number;
  priceMatrix?: PriceMatrixEntry[];
  createdAt?: Date;
  promotionText?: string;
  range?: number;
  transmission?: TransmissionType;
  isAvailable?: boolean;
  deliveryTime?: string;
  customColors?: CustomColor[];
  listPrice?: number;
  includedServices?: string[];
  oneTimeCosts?: OneTimeCost[];
  promotionColor?: string;
  co2Emissions?: string;
}

export interface OneTimeCost {
  name: string;
  amount: number;
  price: number;
  isInclusive: boolean;
  description?: string;
}

export interface PriceMatrixEntry {
  duration: number;
  mileage: number;
  price: number;
}

export interface CustomColor {
  id: string;
  name: string;
}
