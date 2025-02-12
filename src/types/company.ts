export interface CompanyInviteData {
  name: string;
  legalForm: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  logoUrl?: string;
  invitedBy: string; // Broker's ID who invited the company
}

export interface EmailLogEntry {
  type: 'invitation' | 'reminder' | 'verification';
  sentAt: string;
  success: boolean;
  error?: string;
}

export interface Company {
  id: string;
  name: string;
  legalForm: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  status: 'pending' | 'active' | 'inactive';
  verificationId?: string;
  firstLoginAt?: string;
  lastLoginAt?: string;
  emailLog?: EmailLogEntry[];
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  invitedBy?: string;
  brokerName?: string;
}
