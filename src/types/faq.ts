import { User } from './auth';

export type FAQTarget = 'employer' | 'broker' | 'employee_normal' | 'employee_salary' | 'customer';

export interface FAQ {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targets: FAQTarget[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: User;
}

export interface FAQFormData {
  title: string;
  content: string;
  imageUrl?: string;
  targets: FAQTarget[];
}