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
    summary: boolean;
    expertise: boolean;
    achievements: boolean;
    experience: boolean;
    education: boolean;
    additional: boolean;
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
    website: string;
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
  // Ensure all data is properly serializable for Supabase storage
  // by making sure no undefined values exist
  const safeData = JSON.parse(JSON.stringify(data));
  
  return {
    basics: {
      name: safeData.personalInfo.fullName || '',
      label: safeData.personalInfo.title || '',
      email: safeData.personalInfo.email || '',
      phone: safeData.personalInfo.phone || '',
      url: safeData.personalInfo.website || '',
      location: {
        address: safeData.personalInfo.location || '',
        city: '',
        region: '',
        postalCode: '',
        countryCode: ''
      },
      summary: safeData.personalInfo.summary || ''
    },
    work: (safeData.experience || []).map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      website: '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      summary: exp.description || '',
      highlights: []
    })),
    education: (safeData.education || []).map(edu => ({
      institution: edu.school || '',
      area: edu.field || '',
      studyType: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: '',
      description: edu.description || '',
      id: edu.id || 0,
      school: edu.school || '',
      degree: edu.degree || '',
      field: edu.field || ''
    })),
    skills: (safeData.skills || []).map(skill => ({
      name: skill || '',
      level: '',
      keywords: []
    })),
    languages: (safeData.languages || []).map(lang => ({
      language: lang || '',
      fluency: ''
    })),
    projects: [],
    // Additional fields
    sections: safeData.sections || {
      summary: true,
      expertise: true,
      achievements: true,
      experience: true,
      education: true,
      additional: true
    },
    experience: safeData.experience || [],
    certifications: safeData.certifications || [],
    awards: safeData.awards || [],
    expertise: safeData.expertise || [],
    achievements: safeData.achievements || [],
    personalInfo: safeData.personalInfo || {}
  };
}

// Helper function to convert ResumeData to ResumeDataType for internal use
export function convertToResumeDataType(data: ResumeData): ResumeDataType {
  try {
    // Ensure we have a safe copy of the data to work with
    const safeData = typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : {};
    
    // Set defaults for potentially missing data
    if (!safeData.basics) safeData.basics = {};
    if (!safeData.work) safeData.work = [];
    if (!safeData.education) safeData.education = [];
    if (!safeData.skills) safeData.skills = [];
    if (!safeData.languages) safeData.languages = [];
    
    // Create a default personalInfo object from basics if personalInfo is not provided
    const personalInfo = safeData.personalInfo || {
      fullName: safeData.basics.name || '',
      title: safeData.basics.label || '',
      email: safeData.basics.email || '',
      phone: safeData.basics.phone || '',
      location: safeData.basics.location?.address || '',
      summary: safeData.basics.summary || '',
      website: safeData.basics.url || ''
    };
    
    // Handle direct experience field or convert from work
    const experience = safeData.experience || safeData.work.map((job: any, index: number) => ({
      id: index + 1,
      company: job.company || '',
      position: job.position || '',
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      description: job.summary || ''
    }));
    
    // Convert education
    const education = safeData.education.map((edu: any, index: number) => ({
      id: edu.id || index + 1,
      school: edu.school || edu.institution || '',
      degree: edu.degree || edu.studyType || '',
      field: edu.field || edu.area || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || ''
    }));
    
    // Handle skills array which can be complex objects or strings
    const skills = Array.isArray(safeData.skills) 
      ? safeData.skills.map((s: any) => typeof s === 'string' ? s : (s.name || ''))
      : [];
    
    // Handle languages array
    const languages = Array.isArray(safeData.languages)
      ? safeData.languages.map((l: any) => typeof l === 'string' ? l : (l.language || ''))
      : [];
    
    return {
      personalInfo,
      experience,
      education,
      skills,
      languages,
      certifications: safeData.certifications || [],
      awards: safeData.awards || [],
      expertise: safeData.expertise || [],
      achievements: safeData.achievements || [],
      sections: safeData.sections || {
        summary: true,
        expertise: true,
        achievements: true,
        experience: true,
        education: true,
        additional: true
      }
    };
  } catch (error) {
    console.error('Error converting ResumeData to ResumeDataType:', error);
    // Return empty default data as fallback
    return {
      personalInfo: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        website: ''
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      awards: []
    };
  }
}
