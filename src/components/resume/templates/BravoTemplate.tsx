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
  sections?: {
    summary: boolean;
    expertise: boolean;
    achievements: boolean;
    experience: boolean;
    education: boolean;
    additional: boolean;
  };
}

interface BravoTemplateProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
}

const BravoTemplate: React.FC<BravoTemplateProps> = ({ 
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

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <h2 className="text-xl text-gray-700 uppercase tracking-wider mb-4">
          {resumeData.personalInfo.title || 'Professional Title'}
        </h2>
        
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap">
          {resumeData.personalInfo.location && (
            <span>{resumeData.personalInfo.location}</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>|</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo.email && (
            <span>|</span>
          )}
          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.website && (
            <span>|</span>
          )}
          {resumeData.personalInfo.website && (
            <span>{resumeData.personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {sections.summary && resumeData.personalInfo.summary && (
        <div className="mb-8 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <p className="text-sm leading-relaxed">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Areas of Expertise */}
      {sections.expertise && resumeData.skills.some(skill => skill) && (
        <div className="mb-8 relative group">
          {renderSectionToggle('expertise', sections.expertise)}
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            AREA OF EXPERTISE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resumeData.skills.filter(skill => skill).map((skill, index) => (
              <div key={index} className="text-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Achievements section */}
      {sections.achievements && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-8 relative group">
          {renderSectionToggle('achievements', sections.achievements)}
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            KEY ACHIEVEMENTS
          </h2>
          <ul className="list-disc pl-5">
            {resumeData.experience
              .filter(exp => exp.description)
              .flatMap((exp) => 
                exp.description.split('\n')
                  .filter(line => line.trim())
                  .slice(0, 2) // Just take the first two achievements from each job
              )
              .slice(0, 4) // Limit to 4 total achievements
              .map((achievement, idx) => (
                <li key={idx} className="mb-2 text-sm">
                  <strong>{achievement.split('.')[0]}.</strong>
                  {achievement.split('.').slice(1).join('.')}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Work Experience Section */}
      {sections.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-8 relative group">
          {renderSectionToggle('experience', sections.experience)}
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.experience
            .filter(exp => exp.company)
            .map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.company || 'Company'}, {exp.position || 'Position'}</h3>
                  <span className="text-sm text-gray-600">{exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}</span>
                </div>
                <ul className="list-disc pl-5 mt-1 text-sm">
                  {exp.description.split('\n').map((point, idx) => (
                    point.trim() && <li key={idx}>{point.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Education Section */}
      {sections.education && resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-8 relative group">
          {renderSectionToggle('education', sections.education)}
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            EDUCATION
          </h2>
          {resumeData.education
            .filter(edu => edu.school)
            .map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h3>
                  <span className="text-sm text-gray-600">{edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}</span>
                </div>
                <p className="text-sm">{edu.school || 'School/University'}</p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
        </div>
      )}

      {/* Additional Information */}
      {sections.additional && (
        <div className="mb-6 relative group">
          {renderSectionToggle('additional', sections.additional)}
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
            ADDITIONAL INFORMATION
          </h2>
          
          {/* Languages Section */}
          {resumeData.languages.some(lang => lang) && (
            <div className="mb-2">
              <p className="font-bold inline text-sm">Languages:</p>{' '}
              <span className="text-sm">{resumeData.languages.filter(l => l).join(', ')}</span>
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.some(cert => cert) && (
            <div className="mb-2">
              <p className="font-bold inline text-sm">Certifications:</p>{' '}
              <span className="text-sm">{resumeData.certifications.filter(c => c).join(', ')}</span>
            </div>
          )}

          {/* Awards Section */}
          {resumeData.awards && resumeData.awards.some(award => award) && (
            <div className="mb-2">
              <p className="font-bold inline text-sm">Awards/Activities:</p>{' '}
              <span className="text-sm">{resumeData.awards.filter(a => a).join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BravoTemplate; 