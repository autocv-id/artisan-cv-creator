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
  sections?: {
    summary: boolean;
    expertise: boolean;
    achievements: boolean;
    experience: boolean;
    education: boolean;
    additional: boolean;
  };
}

interface CharlieTemplateProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
}

const CharlieTemplate: React.FC<CharlieTemplateProps> = ({ 
  resumeData, 
  photoUrl,
  isEditable = false,
  onSectionToggle 
}) => {
  // Inisialisasi status section jika belum ada
  const sections = resumeData.sections || {
    summary: true,
    expertise: true,
    achievements: true,
    experience: true,
    education: true,
    additional: true
  };
  
  // Helper function untuk menampilkan tombol toggle section
  const renderSectionToggle = (section: string, visible: boolean) => {
    if (!isEditable || !onSectionToggle) return null;
    
    return (
      <button 
        className="absolute top-0 right-0 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onSectionToggle(section, !visible)}
      >
        {visible ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    );
  };

  // Split description into bullet points for experience and education
  const formatDescription = (description: string) => {
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <div className="bg-white w-full min-h-[1050px] p-8 font-sans text-gray-800 shadow">
      {/* Header with blue accent */}
      <div className="border-b-4 border-blue-600 pb-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-1">{resumeData.personalInfo.fullName}</h1>
            <h2 className="text-xl text-gray-700 mb-3">{resumeData.personalInfo.title}</h2>
            
            <div className="text-sm space-y-1">
              {resumeData.personalInfo.email && (
                <div><span className="font-semibold">Email:</span> {resumeData.personalInfo.email}</div>
              )}
              {resumeData.personalInfo.phone && (
                <div><span className="font-semibold">Phone:</span> {resumeData.personalInfo.phone}</div>
              )}
              {resumeData.personalInfo.location && (
                <div><span className="font-semibold">Location:</span> {resumeData.personalInfo.location}</div>
              )}
              {resumeData.personalInfo.website && (
                <div><span className="font-semibold">Website:</span> {resumeData.personalInfo.website}</div>
              )}
            </div>
          </div>
          
          {photoUrl && (
            <div className="mt-3 md:mt-0">
              <img 
                src={photoUrl} 
                alt={resumeData.personalInfo.fullName} 
                className="w-24 h-24 object-cover rounded-md border-2 border-blue-600"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Summary */}
      {sections.summary && resumeData.personalInfo.summary && (
        <div className="mb-6 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2">Professional Summary</h3>
          <p className="text-sm text-gray-700">{resumeData.personalInfo.summary}</p>
        </div>
      )}
      
      {/* Two column layout for the main content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - wider */}
        <div className="md:w-2/3">
          {/* Experience */}
          {sections.experience && resumeData.experience && resumeData.experience.length > 0 && (
            <div className="mb-6 relative group">
              {renderSectionToggle('experience', sections.experience)}
              <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-3">Professional Experience</h3>
              
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold">{exp.position}</h4>
                    <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{exp.company}</p>
                  
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-1 space-y-1">
                    {formatDescription(exp.description).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          {/* Education */}
          {sections.education && resumeData.education && resumeData.education.length > 0 && (
            <div className="mb-6 relative group">
              {renderSectionToggle('education', sections.education)}
              <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-3">Education</h3>
              
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold">{edu.degree} in {edu.field}</h4>
                    <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{edu.school}</p>
                  
                  {edu.description && (
                    <p className="text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - narrower */}
        <div className="md:w-1/3">
          {/* Skills */}
          {sections.expertise && resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0] !== '' && (
            <div className="mb-6 relative group">
              {renderSectionToggle('expertise', sections.expertise)}
              <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2">Skills</h3>
              <ul className="text-sm">
                {resumeData.skills.map((skill, index) => (
                  <li key={index} className="mb-1 bg-blue-50 p-1 rounded">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Additional Information */}
          {sections.additional && (
            <div className="relative group">
              {renderSectionToggle('additional', sections.additional)}
            
              {/* Languages */}
              {resumeData.languages && resumeData.languages.length > 0 && resumeData.languages[0] !== '' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2">Languages</h3>
                  <ul className="text-sm">
                    {resumeData.languages.map((language, index) => (
                      <li key={index} className="mb-1">{language}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Certifications */}
              {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0] !== '' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2">Certifications</h3>
                  <ul className="text-sm">
                    {resumeData.certifications.map((cert, index) => (
                      <li key={index} className="mb-1">{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Awards */}
              {resumeData.awards && resumeData.awards.length > 0 && resumeData.awards[0] !== '' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2">Awards & Activities</h3>
                  <ul className="text-sm">
                    {resumeData.awards.map((award, index) => (
                      <li key={index} className="mb-1">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharlieTemplate; 