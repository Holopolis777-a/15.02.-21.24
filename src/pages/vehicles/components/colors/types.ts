export interface ColorOption {
  name: string;
  code: string;
  price: number;
}

export interface ColorData {
  name: string;
  code: string;
  price: number;
  isCustom?: boolean;
}