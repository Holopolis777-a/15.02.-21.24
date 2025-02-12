export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  trimLevel?: string;
  color?: string;
  images?: string[];
  price?: number;
  category?: string;
  categories?: string[];
  fuelType?: string;
  power?: number;
  consumption?: string;
  co2?: string;
  description?: string;
  standardFeatures?: string[];
  additionalFeatures?: string[];
  standardEquipment?: string;
  basePrice?: number;
  salaryConversionPrice?: number;
  priceMatrix?: PriceMatrixEntry[];
  createdAt?: Date;
  promotionText?: string;
  range?: string;
  transmission?: string;
  isAvailable?: boolean;
  deliveryTime?: string;
  customColors?: CustomColor[];
  listPrice?: number;
  includedServices?: string[];
  oneTimeCosts?: OneTimeCost[];
  promotionColor?: string;
  co2Emissions?: string;
  electricRange?: string;
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
