export type TemplateCategory = 'free' | 'premium';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
} 