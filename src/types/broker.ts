export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface BrokerInviteFormData {
  email: string;
  fullName: string;
  phone: string;
  companyName: string;
  address: Address;
  logo?: string; // base64 data
  logoUrl?: string;
  commissionPerVehicle?: number;
  type?: 'regular' | 'sub_broker' | 'supbroker';
}

export interface Broker {
  id: string;
  brokerId: string; // Unique broker ID for tracking relationships
  email: string;
  fullName: string;
  phone: string;
  companyName: string;
  address: Address;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  lastInviteSentAt?: string;
  lastLoginAt?: string;
  logoUrl?: string;
  inviteId?: string;
  inviteStatus?: 'pending' | 'accepted';
  userId?: string;
  commissionPerVehicle: number;
  parentBrokerId?: string; // ID of the broker who invited this broker
  availableCommission: number; // The commission amount this broker can distribute
  originalCommission: number; // The initial commission set by admin
  subBrokers?: string[]; // Broker IDs of sub-brokers
  subBrokerCommissions?: {
    [subBrokerId: string]: number;
  }; // Commission allocated to each sub-broker
  type?: 'regular' | 'sub_broker' | 'supbroker';
}

export interface BrokerCommissionData {
  brokerId: string;
  parentBrokerId?: string;
  commissionPerVehicle: number;
  availableCommission: number;
  originalCommission: number; // The initial commission given by admin
  subBrokerCommissions: {
    [subBrokerId: string]: number;
  };
}

export interface BrokerEmailData {
  brokerId: string;
  email: string;
  fullName: string;
  companyName: string;
  verificationToken: string;
  setupUrl: string;
  portalUrl: string;
  logoUrl: string;
  isReminder?: boolean;
}
