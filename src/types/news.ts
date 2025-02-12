import { User } from './auth';

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  price?: number;
  externalUrl?: string;
  publishedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  author?: User;
  targetGroups: string[];
  views: number;
  interactions: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface NewsPermission {
  id: string;
  roleId: string;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

export interface NewsMedia {
  id: string;
  newsId: string;
  url: string;
  type: 'image' | 'document';
  size: number;
  mimeType: string;
  createdAt: string;
}