export interface Customer {
  id: string;
  fullName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  brokerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInvite {
  id: string;
  email?: string;
  brokerId: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  type?: 'email' | 'link';
}
