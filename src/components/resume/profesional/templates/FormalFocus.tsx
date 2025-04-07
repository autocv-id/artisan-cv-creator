
import React from 'react';
import { ResumeData, ResumeDataType } from '@/types/resume';

// Tambahkan tipe untuk EditableField
interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  isMultiline?: boolean;
  className?: string;
}

// Komponen EditableField untuk inline editing
const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  isMultiline = false,
  className = ""
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onChange(editValue);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  const handleBlur = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    if (isMultiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${className}`}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${className}`}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={`cursor-text hover:bg-gray-100 rounded px-1 -mx-1 ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {value || 'Click to edit'}
    </span>
  );
};

interface FormalFocusProps {
  resumeData: ResumeDataType | ResumeData;
  photoUrl?: string;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
  onUpdatePersonalInfo?: (field: string, value: string) => void;
  onUpdateExperience?: (index: number, field: string, value: string) => void;
  onUpdateEducation?: (index: number, field: string, value: string) => void;
  onUpdateSkill?: (index: number, value: string) => void;
  onUpdateLanguage?: (index: number, value: string) => void;
  onUpdateCertification?: (index: number, value: string) => void;
  onUpdateAward?: (index: number, value: string) => void;
  onUpdateExpertise?: (index: number, value: string) => void;
  onUpdateAchievement?: (index: number, field: 'title' | 'description', value: string) => void;
  onPhotoUpload?: (file: File) => void;
  onAddItem?: (section: string) => void;
  onRemoveItem?: (section: string, index: number) => void;
}

const FormalFocus: React.FC<FormalFocusProps> = ({ 
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
  onRemoveItem
}) => {
  // Convert ResumeData to ResumeDataType if needed
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
          expertise: true,
          achievements: true,
          experience: true,
          education: true,
          additional: true
        }
      };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onPhotoUpload) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  const renderSectionControls = (section: string, index?: number) => {
    if (!isEditable) return null;
    
    if (index === undefined) {
      return onAddItem ? (
        <button 
          onClick={() => onAddItem(section)}
          className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors mt-2"
          aria-label={`Add ${section}`}
        >
          + Add
        </button>
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

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase mb-1">{typedResumeData.personalInfo.fullName}</h1>
        <h2 className="text-xl uppercase mb-2">{typedResumeData.personalInfo.title}</h2>
        <div className="text-sm">
          {typedResumeData.personalInfo.location && <span>{typedResumeData.personalInfo.location}</span>}
          {typedResumeData.personalInfo.phone && <span>{typedResumeData.personalInfo.location ? ' | ' : ''}{typedResumeData.personalInfo.phone}</span>}
          {typedResumeData.personalInfo.email && <span>{typedResumeData.personalInfo.phone ? ' | ' : ''}{typedResumeData.personalInfo.email}</span>}
          {typedResumeData.personalInfo.website && <span>{typedResumeData.personalInfo.email ? ' | ' : ''}{typedResumeData.personalInfo.website}</span>}
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
      
      {/* Work Experience Section */}
      {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6 relative group">
          {renderSectionControls('experience')}
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            WORK EXPERIENCE
          </h2>
          {resumeData.experience
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
      
      {/* Education Section */}
      {resumeData.education && resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-6 relative group">
          {renderSectionControls('education')}
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            EDUCATION
          </h2>
          {resumeData.education
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
      
      {/* Additional Information Section */}
      {(!resumeData.sections || resumeData.sections.additional !== false) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">ADDITIONAL INFORMATION</h2>
          
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mb-4 relative group">
              {renderSectionControls('skills')}
              <h3 className="font-bold text-sm mb-1">Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm">
                      {renderEditableContent(
                        skill,
                        onUpdateSkill ? (value) => onUpdateSkill(index, value) : undefined
                      )}
                    </span>
                    {renderSectionControls('skills', index)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div className="mb-4 relative group">
              {renderSectionControls('languages')}
              <h3 className="font-bold text-sm mb-1">Languages</h3>
              <div className="grid grid-cols-2 gap-4">
                {resumeData.languages.filter(l => l).map((lang, index) => {
                  // Handle both string and object types for languages
                  const languageText = typeof lang === 'string' ? lang : lang.language;
                  return (
                    <div key={index} className="flex items-center">
                      <span className="text-sm">
                        {renderEditableContent(
                          languageText,
                          onUpdateLanguage ? (value) => onUpdateLanguage(index, value) : undefined
                        )}
                      </span>
                      {renderSectionControls('languages', index)}
                    </div>
                  );
                })}
              </div>
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
