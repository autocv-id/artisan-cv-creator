
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
}

interface ProfessionalUXTemplateProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
}

const ProfessionalUXTemplate: React.FC<ProfessionalUXTemplateProps> = ({ resumeData, photoUrl }) => {
  // Split description into bullet points for experience and education
  const formatDescription = (description: string) => {
    return description.split('\n').filter(line => line.trim() !== '');
  };

  return (
    <div className="bg-white w-full min-h-[1050px] font-sans text-gray-800 shadow">
      {/* Header with accent color and sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* Left sidebar */}
        <div className="bg-slate-800 text-white w-full md:w-1/3 p-6">
          {photoUrl && (
            <div className="mb-6 flex justify-center">
              <img 
                src={photoUrl} 
                alt={resumeData.personalInfo.fullName} 
                className="w-32 h-32 object-cover rounded-full border-4 border-white"
              />
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-4 border-b border-white pb-2">Contact</h2>
          <div className="space-y-2 mb-6">
            {resumeData.personalInfo.email && (
              <div className="flex items-start">
                <span className="w-8">📧</span>
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-start">
                <span className="w-8">📱</span>
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-start">
                <span className="w-8">📍</span>
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
            {resumeData.personalInfo.website && (
              <div className="flex items-start">
                <span className="w-8">🌐</span>
                <span>{resumeData.personalInfo.website}</span>
              </div>
            )}
          </div>
          
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && resumeData.skills[0] !== '' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 border-b border-white pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="bg-slate-700 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && resumeData.languages[0] !== '' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 border-b border-white pb-2">Languages</h2>
              <ul className="space-y-1">
                {resumeData.languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0] !== '' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 border-b border-white pb-2">Certifications</h2>
              <ul className="space-y-1">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-2/3 p-8">
          <h1 className="text-3xl font-bold mb-1 text-slate-800">{resumeData.personalInfo.fullName}</h1>
          <h2 className="text-xl text-slate-600 mb-4">{resumeData.personalInfo.title}</h2>
          
          {/* Summary */}
          {resumeData.personalInfo.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">About Me</h3>
              <p className="text-slate-700">{resumeData.personalInfo.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Work Experience</h3>
              
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold text-slate-800">{exp.position}</h4>
                    <span className="text-sm text-slate-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-2">{exp.company}</p>
                  
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {formatDescription(exp.description).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Education</h3>
              
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold text-slate-800">{edu.degree} in {edu.field}</h4>
                    <span className="text-sm text-slate-600">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">{edu.school}</p>
                  
                  {edu.description && (
                    <p className="text-sm text-slate-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Awards */}
          {resumeData.awards && resumeData.awards.length > 0 && resumeData.awards[0] !== '' && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Awards & Activities</h3>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                {resumeData.awards.map((award, index) => (
                  <li key={index}>{award}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalUXTemplate;
