import { User } from './auth';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'solved';
export type TicketCategory = 
  | 'technical' 
  | 'billing' 
  | 'vehicle' 
  | 'account' 
  | 'other';

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TicketComment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  author?: User;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  author?: User;
  assignee?: User;
  companyId?: string;
  companyName?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
}
