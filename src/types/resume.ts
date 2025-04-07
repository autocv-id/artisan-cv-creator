
export interface ResumeData {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    url: string;
    location: {
      address: string;
      city: string;
      region: string;
      postalCode: string;
      countryCode: string;
    };
    summary: string;
  };
  work: {
    company: string;
    position: string;
    website: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description?: string;
    // Additional fields used in templates
    id?: number;
    school?: string;
    degree?: string;
    field?: string;
  }[];
  skills: {
    name: string;
    level: string;
    keywords: string[];
  }[] | string[];
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    url: string;
    highlights: string[];
  }[];
  languages: {
    language: string;
    fluency: string;
  }[] | string[];
  // Additional fields used in templates
  sections?: {
    summary?: boolean;
    expertise?: boolean;
    achievements?: boolean;
    experience?: boolean;
    education?: boolean;
    additional?: boolean;
  };
  experience?: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  certifications?: string[];
  awards?: string[];
  expertise?: string[];
  achievements?: Array<{
    title: string;
    description: string;
  }>;
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website?: string;
  };
}

export interface Resume {
  id: string;
  title: string;
  user_id: string;
  template: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  isPremium: boolean;
}

// Type definition for the resume data structure used in the editor
export type ResumeDataType = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
  expertise?: string[];
  achievements?: Array<{
    title: string;
    description: string;
  }>;
  sections?: {
    summary: boolean;
    expertise: boolean;
    achievements: boolean;
    experience: boolean;
    education: boolean;
    additional: boolean;
  };
};

// Helper function to convert ResumeDataType to ResumeData for API compatibility
export function convertToResumeData(data: ResumeDataType): ResumeData {
  return {
    basics: {
      name: data.personalInfo.fullName,
      label: data.personalInfo.title,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      url: data.personalInfo.website,
      location: {
        address: data.personalInfo.location,
        city: '',
        region: '',
        postalCode: '',
        countryCode: ''
      },
      summary: data.personalInfo.summary
    },
    work: data.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      website: '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: exp.description,
      highlights: []
    })),
    education: data.education.map(edu => ({
      institution: edu.school,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: '',
      description: edu.description,
      id: edu.id,
      school: edu.school,
      degree: edu.degree,
      field: edu.field
    })),
    skills: data.skills.map(skill => ({
      name: skill,
      level: '',
      keywords: []
    })),
    languages: data.languages.map(lang => ({
      language: lang,
      fluency: ''
    })),
    projects: [],
    // Additional fields
    sections: data.sections,
    experience: data.experience,
    certifications: data.certifications,
    awards: data.awards,
    expertise: data.expertise,
    achievements: data.achievements,
    personalInfo: data.personalInfo
  };
}

// Helper function to convert ResumeData to ResumeDataType for internal use
export function convertToResumeDataType(data: ResumeData): ResumeDataType {
  return {
    personalInfo: data.personalInfo || {
      fullName: data.basics.name,
      title: data.basics.label,
      email: data.basics.email,
      phone: data.basics.phone,
      location: data.basics.location.address,
      summary: data.basics.summary,
      website: data.basics.url
    },
    experience: data.experience || data.work.map((job, index) => ({
      id: index + 1,
      company: job.company,
      position: job.position,
      startDate: job.startDate,
      endDate: job.endDate,
      description: job.summary
    })),
    education: data.education.map((edu, index) => ({
      id: edu.id || index + 1,
      school: edu.school || edu.institution,
      degree: edu.degree || edu.studyType,
      field: edu.field || edu.area,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description || ''
    })),
    skills: Array.isArray(data.skills) ? data.skills.map(s => typeof s === 'string' ? s : s.name) : [],
    languages: Array.isArray(data.languages) ? data.languages.map(l => typeof l === 'string' ? l : l.language) : [],
    certifications: data.certifications || [],
    awards: data.awards || [],
    expertise: data.expertise || [],
    achievements: data.achievements || [],
    sections: data.sections || {
      summary: true,
      expertise: true,
      achievements: true,
      experience: true,
      education: true,
      additional: true
    }
  };
}
