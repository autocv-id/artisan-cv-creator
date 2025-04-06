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
  sections?: {
    summary?: boolean;
    expertise?: boolean;
    achievements?: boolean;
    experience?: boolean;
    education?: boolean;
    additional?: boolean;
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
  certifications?: string[];
  awards?: string[];
  expertise?: string[];
  achievements?: Array<{
    title: string;
    description: string;
  }>;
}

interface FormalFocusProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
}

const FormalFocus: React.FC<FormalFocusProps> = ({ 
  resumeData, 
  photoUrl,
  isEditable = false,
  onSectionToggle 
}) => {
  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase mb-1">{resumeData.personalInfo.fullName}</h1>
        <h2 className="text-xl uppercase mb-2">{resumeData.personalInfo.title}</h2>
        <div className="text-sm">
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.location ? ' | ' : ''}{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.phone ? ' | ' : ''}{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.website && <span>{resumeData.personalInfo.email ? ' | ' : ''}{resumeData.personalInfo.website}</span>}
        </div>
      </div>
      <hr className="border-t border-gray-300 mb-6" />
      
      {(!resumeData.sections || resumeData.sections.summary !== false) && (
        <div className="mb-6">
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      )}
      
      {resumeData.expertise && resumeData.expertise.length > 0 && 
       (!resumeData.sections || resumeData.sections.expertise !== false) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">AREA OF EXPERTISE</h2>
          <div className="flex flex-wrap">
            <ul className="list-disc pl-5 w-full md:w-1/2">
              {resumeData.expertise.map((item, index) => (
                <li key={index} className="mb-1 text-sm">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && 
       (!resumeData.sections || resumeData.sections.experience !== false) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-sm">{exp.position}</h3>
                <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-sm italic">{exp.company}</p>
              <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Education Section */}
      {resumeData.education && resumeData.education.length > 0 && 
       (!resumeData.sections || resumeData.sections.education !== false) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-sm">{edu.degree} in {edu.field}</h3>
                <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm italic">{edu.school}</p>
              <p className="text-sm mt-1 whitespace-pre-line">{edu.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Additional Information Section */}
      {(!resumeData.sections || resumeData.sections.additional !== false) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">ADDITIONAL INFORMATION</h2>
          
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1">Languages</h3>
              <p className="text-sm">{resumeData.languages.join(', ')}</p>
            </div>
          )}
          
          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1">Certifications</h3>
              <ul className="list-disc pl-5">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="text-sm">{cert}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Awards */}
          {resumeData.awards && resumeData.awards.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-1">Awards</h3>
              <ul className="list-disc pl-5">
                {resumeData.awards.map((award, index) => (
                  <li key={index} className="text-sm">{award}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormalFocus; 