import { Template } from '../types/template';

export const templates: Template[] = [
  // Free Templates
  {
    id: 'classic',
    name: 'Classic',
    description: 'A clean and professional resume template suitable for any job application',
    thumbnail: '/templates/classic.png',
    category: 'free'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A simple and elegant resume template with a focus on content',
    thumbnail: '/templates/minimal.png',
    category: 'free'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A contemporary resume template with a fresh look',
    thumbnail: '/templates/modern.png',
    category: 'free'
  },
  
  // Premium Templates
  {
    id: 'executive',
    name: 'Executive',
    description: 'A premium template designed for senior professionals and executives',
    thumbnail: '/templates/executive.png',
    category: 'premium'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with this artistic template perfect for creative professionals',
    thumbnail: '/templates/creative.png',
    category: 'premium'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Showcase your technical skills with this specialized template',
    thumbnail: '/templates/technical.png',
    category: 'premium'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Ideal for researchers, professors, and academic professionals',
    thumbnail: '/templates/academic.png',
    category: 'premium'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'A sophisticated template with advanced formatting options',
    thumbnail: '/templates/professional.png',
    category: 'premium'
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getFreeTemplates = (): Template[] => {
  return templates.filter(template => template.category === 'free');
};

export const getPremiumTemplates = (): Template[] => {
  return templates.filter(template => template.category === 'premium');
}; 