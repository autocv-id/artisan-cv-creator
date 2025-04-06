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
  certifications?: string[];
  awards?: string[];
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
}

interface AlphaTemplateProps {
  resumeData: ResumeDataType;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
}

const AlphaTemplate: React.FC<AlphaTemplateProps> = ({ 
  resumeData, 
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

  // Helper function untuk memecah description menjadi bullet points
  const renderBulletPoints = (description: string) => {
    return description.split('\n').map((point, idx) => 
      point.trim() && <li key={idx} className="mb-1 text-sm">{point.trim()}</li>
    );
  };

  // Group expertise into columns
  const expertiseColumns = () => {
    const expertise = resumeData.expertise || [];
    if (expertise.length === 0) return null;
    
    const midpoint = Math.ceil(expertise.length / 2);
    return (
      <div className="flex flex-wrap">
        <ul className="list-disc pl-5 w-full md:w-1/2">
          {expertise.slice(0, midpoint).map((skill, index) => (
            <li key={index} className="mb-1 text-sm">{skill}</li>
          ))}
        </ul>
        {expertise.length > midpoint && (
          <ul className="list-disc pl-5 w-full md:w-1/2">
            {expertise.slice(midpoint).map((skill, index) => (
              <li key={index} className="mb-1 text-sm">{skill}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase mb-1">{resumeData.personalInfo.fullName || 'YOUR NAME'}</h1>
        <h2 className="text-xl uppercase mb-2">{resumeData.personalInfo.title || 'PROFESSIONAL TITLE'}</h2>
        <div className="text-sm">
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          {resumeData.personalInfo.phone && resumeData.personalInfo.location && <span> | </span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.email && (resumeData.personalInfo.phone || resumeData.personalInfo.location) && <span> | </span>}
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.website && (resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.location) && <span> | </span>}
          {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
        </div>
      </div>

      <hr className="border-t border-gray-300 mb-6" />

      {/* Professional Summary Section */}
      {sections.summary && resumeData.personalInfo.summary && (
        <div className="mb-6 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Area of Expertise Section */}
      {sections.expertise && resumeData.expertise && resumeData.expertise.length > 0 && (
        <div className="mb-6 relative group">
          {renderSectionToggle('expertise', sections.expertise)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            AREA OF EXPERTISE
          </h2>
          {expertiseColumns()}
        </div>
      )}

      {/* Key Achievements Section */}
      {sections.achievements && resumeData.achievements && resumeData.achievements.length > 0 && (
        <div className="mb-6 relative group">
          {renderSectionToggle('achievements', sections.achievements)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            KEY ACHIEVEMENTS
          </h2>
          <ul className="list-disc pl-5">
            {resumeData.achievements.map((achievement, index) => (
              <li key={index} className="mb-2 text-sm">
                <span className="font-bold">{achievement.title}.</span> {achievement.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Professional Experience Section */}
      {sections.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('experience', sections.experience)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.experience
            .filter(exp => exp.company)
            .map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base">{exp.company || 'Company'}, {exp.position || 'Position'}</h3>
                  <span className="text-sm">{exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}</span>
                </div>
                <ul className="list-disc pl-5 mt-2">
                  {renderBulletPoints(exp.description)}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Education Section */}
      {sections.education && resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('education', sections.education)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            EDUCATION
          </h2>
          {resumeData.education
            .filter(edu => edu.school)
            .map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-sm">{edu.school || 'School/University'}</p>
                  </div>
                  <span className="text-sm">{edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}</span>
                </div>
                {edu.description && (
                  <ul className="list-disc pl-5 mt-2">
                    {renderBulletPoints(edu.description)}
                  </ul>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Additional Information Section */}
      {sections.additional && (
        <div className="mb-6 relative group">
          {renderSectionToggle('additional', sections.additional)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            ADDITIONAL INFORMATION
          </h2>
          
          {/* Languages Section */}
          {resumeData.languages.some(lang => lang) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Languages:</span> {resumeData.languages.filter(l => l).join(', ')}</p>
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.some(cert => cert) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Certifications:</span> {resumeData.certifications.filter(c => c).join(', ')}</p>
            </div>
          )}

          {/* Awards Section */}
          {resumeData.awards && resumeData.awards.some(award => award) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Awards/Activities:</span> {resumeData.awards.filter(a => a).join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlphaTemplate; 