export type UserRole = 'admin' | 'employer' | 'broker' | 'employee_normal' | 'employee_salary' | 'customer';
export type UserStatus = 'pending' | 'active' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
  employerCompanyId?: string;
  brokerId?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  mobileNumber?: string;
  isProfileComplete?: boolean;
  portalType?: 'normal' | 'salary';
  phone?: string;
  status?: UserStatus;
  inviteId?: string;
}
