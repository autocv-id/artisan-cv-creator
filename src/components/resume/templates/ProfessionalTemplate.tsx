
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
}

interface ProfessionalTemplateProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ resumeData, photoUrl }) => {
  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      <div className="flex flex-row mb-6">
        {photoUrl && (
          <div className="mr-6">
            <img 
              src={photoUrl} 
              alt="Profile" 
              className="w-32 h-32 object-cover border border-gray-300"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#003366] uppercase mb-2">
            {resumeData.personalInfo.fullName || 'YOUR NAME'}
          </h1>
          
          <div className="grid grid-cols-2 gap-1">
            {resumeData.personalInfo.location && (
              <div className="flex items-start">
                <span className="font-semibold mr-2">Address:</span>
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-start">
                <span className="font-semibold mr-2">Phone:</span>
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.email && (
              <div className="flex items-start">
                <span className="font-semibold mr-2">Email:</span>
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.website && (
              <div className="flex items-start">
                <span className="font-semibold mr-2">Website:</span>
                <span>{resumeData.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#003366] uppercase border-b-2 border-gray-300 pb-1 mb-3">SUMMARY</h2>
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience Section */}
      {resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#003366] uppercase border-b-2 border-gray-300 pb-1 mb-3">WORK EXPERIENCE</h2>
          {resumeData.experience
            .filter(exp => exp.company)
            .map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{exp.position || 'Position'}, {exp.company || 'Company'}</h3>
                  <span className="text-sm">{exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}</span>
                </div>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  {exp.description.split('\n').map((point, idx) => (
                    point.trim() && <li key={idx}>{point.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Education Section */}
      {resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#003366] uppercase border-b-2 border-gray-300 pb-1 mb-3">EDUCATION</h2>
          {resumeData.education
            .filter(edu => edu.school)
            .map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold">{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</h3>
                  <span className="text-sm">{edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}</span>
                </div>
                <p className="text-sm">{edu.school || 'School/University'}</p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
        </div>
      )}

      {/* Additional Information Section */}
      <div className="mb-6">
        {/* Skills Section */}
        {resumeData.skills.some(skill => skill) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#003366] uppercase border-b-2 border-gray-300 pb-1 mb-3">ADDITIONAL INFORMATION</h2>
            <div className="mb-2">
              <p className="font-bold inline">Technical Skills:</p>{' '}
              {resumeData.skills.filter(s => s).join(', ')}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {resumeData.languages.some(lang => lang) && (
          <div className="mb-2">
            <p className="font-bold inline">Languages:</p>{' '}
            {resumeData.languages.filter(l => l).join(', ')}
          </div>
        )}

        {/* Certifications Section */}
        {resumeData.certifications && resumeData.certifications.some(cert => cert) && (
          <div className="mb-2">
            <p className="font-bold inline">Certifications:</p>{' '}
            {resumeData.certifications.filter(c => c).join(', ')}
          </div>
        )}

        {/* Awards Section */}
        {resumeData.awards && resumeData.awards.some(award => award) && (
          <div className="mb-2">
            <p className="font-bold inline">Awards/Activities:</p>{' '}
            {resumeData.awards.filter(a => a).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
