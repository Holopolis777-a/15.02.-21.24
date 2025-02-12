import { PriceMatrixEntry } from '../types/vehicle';

export const getLowestMonthlyRate = (priceMatrix: PriceMatrixEntry[] = []): number => {
  if (priceMatrix.length === 0) return 0;
  
  // Find the lowest price across all durations
  const allPrices = priceMatrix.map(entry => entry.price);
  return Math.min(...allPrices);
};
