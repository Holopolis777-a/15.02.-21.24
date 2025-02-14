export interface SalaryConversionConfig {
  grossSalary: number;
  taxClass: string;
  churchTax: string;
  powerCosts: string;
  distance: number;
  effectiveCost: number;
  listPrice?: number;
}

export type OrderStatus =
  | 'credit_check_started'
  | 'credit_check_passed'
  | 'credit_check_failed'
  | 'lease_contract_sent'
  | 'lease_contract_signed'
  | 'in_delivery'
  | 'delivered'
  | 'cancelled';

export type RegularStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'lease_offer_sent'
  | 'lease_request_submitted'
  | 'lease_request_approved'
  | 'lease_request_rejected'
  | 'in_delivery'
  | 'delivered'
  | 'withdrawn'
  | 'closed';

export type SalaryStatus = RegularStatus | 'salary_conversion_approved' | 'salary_conversion_rejected';

export interface VehicleRequest {
  brokerId?: string;
  invitedByBrokerId?: string;
  orderNumber?: string;
  vehicleImage?: string;
  features?: {
    name: string;
    included: boolean;
  }[];
  id?: string;
  userId: string;
  companyId: string;
  vehicleId: string;
  brand: string;
  model: string;
  trimLevel?: string;
  color?: string;
  duration: number;
  mileagePerYear: number;
  monthlyRate: number;
  type: 'regular' | 'salary_conversion';
  category?: 'company' | 'private';
  salaryConversion?: SalaryConversionConfig;
  status: SalaryStatus | OrderStatus;
  isOrder?: boolean;
  createdAt: {
    toDate: () => Date;
  } | Date;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  sonstigeAusstattung?: string[];
  zusatzausstattung?: string[];
  trimLevel?: string;
  color?: string;
  images?: string[];
  price?: number;
  category?: string;
  fuelType?: string;
  power?: string;
  consumption?: string;
  co2?: string;
  description?: string;
}

export interface VehicleRequestWithCompany extends VehicleRequest {
  company: {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  employee?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    email: string;
    mobileNumber: string;
  };
}
