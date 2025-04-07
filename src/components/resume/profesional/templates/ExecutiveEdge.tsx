import React from 'react';
import { ResumeData, ResumeDataType } from '@/types/resume';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isMultiline?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onChange, 
  className = "", 
  isMultiline = false 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement | HTMLSpanElement>(null);
  
  const handleBlur = () => {
    if (elementRef.current) {
      onChange(elementRef.current.innerText);
      setIsEditing(false);
    }
  };
  
  const handleClick = () => {
    setIsEditing(true);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isMultiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    
    if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerText = value;
        elementRef.current.blur();
      }
    }
  };
  
  const editableStyle = `
    ${isEditing ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-gray-50'}
    outline-none rounded px-1 transition-colors duration-150 ease-in-out cursor-pointer
    ${className}
  `;
  
  return isMultiline ? (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={editableStyle}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  ) : (
    <span
      ref={elementRef as React.RefObject<HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={editableStyle}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

interface ExecutiveEdgeProps {
  resumeData: ResumeDataType | ResumeData;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
  onUpdatePersonalInfo?: (field: string, value: string) => void;
  onUpdateExperience?: (id: number, field: string, value: string) => void;
  onUpdateEducation?: (id: number, field: string, value: string) => void;
  onUpdateSkill?: (index: number, value: string) => void;
  onUpdateLanguage?: (index: number, value: string) => void;
  onUpdateCertification?: (index: number, value: string) => void;
  onUpdateAward?: (index: number, value: string) => void;
  onUpdateExpertise?: (index: number, value: string) => void;
  onUpdateAchievement?: (index: number, field: 'title' | 'description', value: string) => void;
  onPhotoUpload?: (file: File) => void;
  onAddItem?: (section: string) => void;
  onRemoveItem?: (section: string, index: number) => void;
  onAddContactInfo?: (type: string) => void;
}

const ExecutiveEdge: React.FC<ExecutiveEdgeProps> = ({ 
  resumeData, 
  photoUrl,
  isEditable = false,
  onSectionToggle,
  onUpdatePersonalInfo,
  onUpdateExperience,
  onUpdateEducation,
  onUpdateSkill,
  onUpdateLanguage,
  onUpdateCertification,
  onUpdateAward,
  onUpdateExpertise,
  onUpdateAchievement,
  onPhotoUpload,
  onAddItem,
  onRemoveItem,
  onAddContactInfo
}) => {
  const typedResumeData = 'personalInfo' in resumeData 
    ? resumeData as ResumeDataType 
    : {
        personalInfo: {
          fullName: (resumeData as ResumeData).basics.name,
          title: (resumeData as ResumeData).basics.label,
          email: (resumeData as ResumeData).basics.email,
          phone: (resumeData as ResumeData).basics.phone,
          location: (resumeData as ResumeData).basics.location.address,
          summary: (resumeData as ResumeData).basics.summary,
          website: (resumeData as ResumeData).basics.url
        },
        experience: (resumeData as ResumeData).work.map((job, index) => ({
          id: index + 1,
          company: job.company,
          position: job.position,
          startDate: job.startDate,
          endDate: job.endDate,
          description: job.summary
        })),
        education: (resumeData as ResumeData).education.map((edu, index) => ({
          id: index + 1,
          school: edu.school || edu.institution,
          degree: edu.degree || edu.studyType,
          field: edu.field || edu.area,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description || ''
        })),
        skills: Array.isArray((resumeData as ResumeData).skills) 
          ? (resumeData as ResumeData).skills.map(s => typeof s === 'string' ? s : s.name) 
          : [],
        languages: Array.isArray((resumeData as ResumeData).languages) 
          ? (resumeData as ResumeData).languages.map(l => typeof l === 'string' ? l : l.language) 
          : [],
        certifications: (resumeData as any).certifications || [],
        awards: (resumeData as any).awards || [],
        expertise: (resumeData as any).expertise || [],
        achievements: (resumeData as any).achievements || [],
        sections: (resumeData as any).sections || {
          summary: true,
          expertise: false,
          achievements: false,
          experience: true,
          education: true,
          additional: true
        }
      };
  
  const sections = typedResumeData.sections || {
    summary: true,
    expertise: false,
    achievements: false,
    experience: true,
    education: true,
    additional: true
  };
  
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

  const renderBulletPoints = (description: string) => {
    return description.split('\n').map((point, idx) => 
      point.trim() && <li key={idx} className="mb-1 text-sm">{point.trim()}</li>
    );
  };

  const renderEditableContent = (
    value: string, 
    onChange?: (value: string) => void, 
    isMultiline: boolean = false,
    className: string = ""
  ) => {
    if (isEditable && onChange) {
      return (
        <EditableField 
          value={value} 
          onChange={onChange} 
          isMultiline={isMultiline}
          className={className}
        />
      );
    }
    return <span className={className}>{value}</span>;
  };

  const renderSectionControls = (section: string, index?: number) => {
    if (!isEditable) return null;
    
    if (index === undefined) {
      return onAddItem ? (
        <div className="mt-2 text-left">
          <button 
            onClick={() => onAddItem(section)}
            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            aria-label={`Tambah ${section}`}
          >
            + Add
          </button>
        </div>
      ) : null;
    }
    
    return onRemoveItem ? (
      <button 
        onClick={() => onRemoveItem(section, index)}
        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
        aria-label={`Remove ${section}`}
      >
        - Remove
      </button>
    ) : null;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onPhotoUpload) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  const [showContactMenu, setShowContactMenu] = React.useState(false);

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      <div className="flex mb-6">
        <div className="w-32 h-36 mr-6 relative group mt-2">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover border border-gray-300" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center border border-gray-300">
              <span className="text-gray-500 text-xs text-center">Foto Profil</span>
            </div>
          )}
          
          {isEditable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <label htmlFor="photo-upload" className="cursor-pointer bg-white text-blue-900 text-xs py-1 px-2 rounded hover:bg-blue-100">
                {photoUrl ? 'Ganti Foto' : 'Unggah Foto'}
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900">
            {renderEditableContent(
              typedResumeData.personalInfo.fullName || 'YOUR NAME',
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('fullName', value) : undefined,
              false,
              "font-bold"
            )}
          </h1>
          
          <div className="mt-4 grid grid-cols-[100px_1fr] gap-y-1">
            <div className="font-bold">Address:</div>
            <div>
              {renderEditableContent(
                typedResumeData.personalInfo.location || 'Your Address',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('location', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Phone:</div>
            <div>
              {renderEditableContent(
                typedResumeData.personalInfo.phone || 'Your Phone',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('phone', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Email:</div>
            <div>
              {renderEditableContent(
                typedResumeData.personalInfo.email || 'Your Email',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('email', value) : undefined
              )}
            </div>
            
            {typedResumeData.personalInfo.website && (
              <>
                <div className="font-bold">Website:</div>
                <div>
                  {renderEditableContent(
                    typedResumeData.personalInfo.website,
                    onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('website', value) : undefined
                  )}
                </div>
              </>
            )}
          </div>
          
          {isEditable && onAddContactInfo && (
            <div className="mt-2 relative">
              <button 
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                onClick={() => setShowContactMenu(!showContactMenu)}
              >
                + Add Contact Info
              </button>
              {showContactMenu && (
                <div className="absolute left-0 mt-1 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                  <button 
                    onClick={() => {
                      onAddContactInfo('website');
                      setShowContactMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Website
                  </button>
                  <button 
                    onClick={() => {
                      onAddContactInfo('linkedin');
                      setShowContactMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    LinkedIn
                  </button>
                  <button 
                    onClick={() => {
                      onAddContactInfo('twitter');
                      setShowContactMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Twitter
                  </button>
                  <button 
                    onClick={() => {
                      onAddContactInfo('github');
                      setShowContactMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    GitHub
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {sections.summary && typedResumeData.personalInfo.summary && (
        <div className="mb-6 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
          <p className="text-sm">
            {renderEditableContent(
              typedResumeData.personalInfo.summary,
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('summary', value) : undefined,
              true
            )}
          </p>
        </div>
      )}

      {sections.experience && typedResumeData.experience.length > 0 && typedResumeData.experience.some(exp => exp.company) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('experience', sections.experience)}
          <h2 className="text-xl font-bold  text-blue-900 border-b border-gray-300 pb-1 mb-2">
            WORK EXPERIENCE
          </h2>
          {typedResumeData.experience
            .filter(exp => exp.company)
            .map((exp, index) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base">
                    {renderEditableContent(
                      exp.position || 'Position',
                      onUpdateExperience ? (value) => onUpdateExperience(exp.id, 'position', value) : undefined
                    )}, 
                    {renderEditableContent(
                      exp.company || 'Company',
                      onUpdateExperience ? (value) => onUpdateExperience(exp.id, 'company', value) : undefined
                    )}
                  </h3>
                  <span className="text-sm">
                    {renderEditableContent(
                      exp.startDate || 'Start Date',
                      onUpdateExperience ? (value) => onUpdateExperience(exp.id, 'startDate', value) : undefined
                    )} - 
                    {renderEditableContent(
                      exp.endDate || 'Present',
                      onUpdateExperience ? (value) => onUpdateExperience(exp.id, 'endDate', value) : undefined
                    )}
                  </span>
                </div>
                <div className="mt-2">
                  {renderEditableContent(
                    exp.description,
                    onUpdateExperience ? (value) => onUpdateExperience(exp.id, 'description', value) : undefined,
                    true,
                    "text-sm"
                  )}
                </div>
                {renderSectionControls('experience', index)}
              </div>
            ))}
          {renderSectionControls('experience')}
        </div>
      )}

      {sections.education && typedResumeData.education.length > 0 && typedResumeData.education.some(edu => edu.school) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('education', sections.education)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
            EDUCATION
          </h2>
          {typedResumeData.education
            .filter(edu => edu.school)
            .map((edu, index) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">
                      {renderEditableContent(
                        edu.degree || 'Degree',
                        onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'degree', value) : undefined
                      )} 
                      {edu.field && 'in '}
                      {edu.field && renderEditableContent(
                        edu.field,
                        onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'field', value) : undefined
                      )}
                    </h3>
                    <p className="text-sm">
                      {renderEditableContent(
                        edu.school || 'School/University',
                        onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'school', value) : undefined
                      )}
                    </p>
                  </div>
                  <span className="text-sm">
                    {renderEditableContent(
                      edu.startDate || 'Start Date',
                      onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'startDate', value) : undefined
                    )} - 
                    {renderEditableContent(
                      edu.endDate || 'End Date',
                      onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'endDate', value) : undefined
                    )}
                  </span>
                </div>
                {edu.description && (
                  <div className="mt-2">
                    {renderEditableContent(
                      edu.description,
                      onUpdateEducation ? (value) => onUpdateEducation(edu.id, 'description', value) : undefined,
                      true,
                      "text-sm"
                    )}
                  </div>
                )}
                {renderSectionControls('education', index)}
              </div>
            ))}
          {renderSectionControls('education')}
        </div>
      )}

      {sections.additional && (
        <div className="mb-6 relative group">
          {renderSectionToggle('additional', sections.additional)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">ADDITIONAL INFORMATION</h2>
          
          {typedResumeData.skills && typedResumeData.skills.length > 0 && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Skills:</span> 
                {typedResumeData.skills.map((skill, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      skill,
                      onUpdateSkill ? (value) => onUpdateSkill(index, value) : undefined
                    )}
                    {renderSectionControls('skills', index)}
                  </span>
                ))}
                {renderSectionControls('skills')}
              </p>
            </div>
          )}
          
          {typedResumeData.languages.some(lang => lang) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Languages:</span> 
                {typedResumeData.languages.filter(l => l).map((lang, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      lang,
                      onUpdateLanguage ? (value) => onUpdateLanguage(index, value) : undefined
                    )}
                    {renderSectionControls('languages', index)}
                  </span>
                ))}
                {renderSectionControls('languages')}
              </p>
            </div>
          )}

          {typedResumeData.certifications && typedResumeData.certifications.some(cert => cert) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Certifications:</span> 
                {typedResumeData.certifications.filter(c => c).map((cert, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      cert,
                      onUpdateCertification ? (value) => onUpdateCertification(index, value) : undefined
                    )}
                    {renderSectionControls('certifications', index)}
                  </span>
                ))}
                {renderSectionControls('certifications')}
              </p>
            </div>
          )}

          {typedResumeData.awards && typedResumeData.awards.some(award => award) && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Awards/Activities:</span> 
                {typedResumeData.awards.filter(a => a).map((award, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      award,
                      onUpdateAward ? (value) => onUpdateAward(index, value) : undefined
                    )}
                    {renderSectionControls('awards', index)}
                  </span>
                ))}
                {renderSectionControls('awards')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveEdge;
