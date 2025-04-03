
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
  }[];
  skills: {
    name: string;
    level: string;
    keywords: string[];
  }[];
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
  }[];
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
