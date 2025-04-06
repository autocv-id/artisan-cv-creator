
import React from 'react';

interface ResumeDataType {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website?: string;
  };
  // ... remaining interface definition ...
}

interface DeltaTemplateProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
}

const DeltaTemplate: React.FC<DeltaTemplateProps> = ({ 
  resumeData, 
  photoUrl,
  isEditable = false,
  onSectionToggle 
}) => {
  // ... implementation ...
};

export default DeltaTemplate; 
