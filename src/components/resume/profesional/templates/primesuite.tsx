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

// Tambahkan tipe untuk EditableField
interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isMultiline?: boolean;
}

// Komponen EditableField untuk inline editing
const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onChange, 
  className = "", 
  isMultiline = false 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement | HTMLSpanElement>(null);
  
  // Menyimpan perubahan saat pengguna selesai mengedit
  const handleBlur = () => {
    if (elementRef.current) {
      onChange(elementRef.current.innerText);
      setIsEditing(false);
    }
  };
  
  // Menangani klik pada elemen
  const handleClick = () => {
    setIsEditing(true);
  };
  
  // Menangani tombol keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Simpan perubahan saat menekan Enter (kecuali pada elemen multiline)
    if (e.key === 'Enter' && !isMultiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    
    // Batalkan editing saat menekan Escape
    if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerText = value;
        elementRef.current.blur();
      }
    }
  };
  
  // Styling untuk elemen yang dapat diedit
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

interface PrimeSuiteTemplateProps {
  resumeData: ResumeDataType;
  isEditable?: boolean;
  onSectionToggle?: (section: string, visible: boolean) => void;
  // Tambahkan fungsi update
  onUpdatePersonalInfo?: (field: string, value: string) => void;
  onUpdateExperience?: (id: number, field: string, value: string) => void;
  onUpdateEducation?: (id: number, field: string, value: string) => void;
  onUpdateSkill?: (index: number, value: string) => void;
  onUpdateLanguage?: (index: number, value: string) => void;
  onUpdateCertification?: (index: number, value: string) => void;
  onUpdateAward?: (index: number, value: string) => void;
  onUpdateExpertise?: (index: number, value: string) => void;
  onUpdateAchievement?: (index: number, field: 'title' | 'description', value: string) => void;
  // Tambahkan fungsi untuk menambah dan menghapus item
  onAddItem?: (section: string) => void;
  onRemoveItem?: (section: string, index: number) => void;
}

const PrimeSuiteTemplate: React.FC<PrimeSuiteTemplateProps> = ({ 
  resumeData, 
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
  onAddItem,
  onRemoveItem
}) => {
  // Initialize section status if not present
  const sections = resumeData.sections || {
    summary: true,
    expertise: true,
    achievements: true,
    experience: true,
    education: true,
    additional: true
  };
  
  // Helper function for section toggle buttons
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

  // Helper function to split description into bullet points
  const renderBulletPoints = (description: string) => {
    return description.split('\n').map((point, idx) => 
      point.trim() && <li key={idx} className="mb-1 text-sm">{point.trim()}</li>
    );
  };

  // Render editable content
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

  // Render tombol tambah dan hapus untuk section
  const renderSectionControls = (section: string, index?: number) => {
    if (!isEditable) return null;
    
    // Jika index tidak ada, ini adalah section header, tampilkan tombol tambah
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
    
    // Jika index ada, ini adalah item dalam section, tampilkan tombol hapus
    return onRemoveItem ? (
      <button 
        onClick={() => onRemoveItem(section, index)}
        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
        aria-label={`Hapus ${section}`}
      >
        - Delete
      </button>
    ) : null;
  };

  // Handle adding contact info
  const handleAddContactInfo = () => {
    if (onAddItem) {
      // Determine which contact info is missing and add it
      if (!resumeData.personalInfo.email) {
        onUpdatePersonalInfo && onUpdatePersonalInfo('email', 'your.email@example.com');
      } else if (!resumeData.personalInfo.phone) {
        onUpdatePersonalInfo && onUpdatePersonalInfo('phone', '+1 234 567 890');
      } else if (!resumeData.personalInfo.website) {
        onUpdatePersonalInfo && onUpdatePersonalInfo('website', 'www.yourwebsite.com');
      } else if (!resumeData.personalInfo.location) {
        onUpdatePersonalInfo && onUpdatePersonalInfo('location', 'City, Country');
      }
    }
  };

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold uppercase mb-1">
          {renderEditableContent(
            resumeData.personalInfo.fullName || 'YOUR NAME', 
            onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('fullName', value) : undefined,
            false,
            "font-bold"
          )}
        </h1>
        <h2 className="text-xl uppercase mb-3">
          {renderEditableContent(
            resumeData.personalInfo.title || 'PROFESSIONAL TITLE', 
            onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('title', value) : undefined
          )}
        </h2>
        <div className="text-sm relative group">
          {resumeData.personalInfo.location && 
            <span>
              {renderEditableContent(
                resumeData.personalInfo.location, 
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('location', value) : undefined
              )}
            </span>
          }
          {resumeData.personalInfo.email && 
            <span> | {renderEditableContent(
              resumeData.personalInfo.email, 
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('email', value) : undefined
            )}</span>
          }
          {resumeData.personalInfo.website && 
            <span> | {renderEditableContent(
              resumeData.personalInfo.website, 
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('website', value) : undefined
            )}</span>
          }
          {resumeData.personalInfo.phone && 
            <span> | {renderEditableContent(
              resumeData.personalInfo.phone, 
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('phone', value) : undefined
            )}</span>
          }
          {isEditable && onUpdatePersonalInfo && (
            <div className="mt-2 text-center">
              <button 
                onClick={handleAddContactInfo}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                aria-label="Tambah Contact Info"
              >
                + Add Contact Info
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="border-t border-gray-300 mb-2" />

      {/* Professional Summary Section */}
      {sections.summary && resumeData.personalInfo.summary && (
        <div className="mb-1 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <p className="text-sm">
            {renderEditableContent(
              resumeData.personalInfo.summary, 
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('summary', value) : undefined,
              true
            )}
          </p>
        </div>
      )}

      {/* Area of Expertise Section */}
      {sections.expertise && resumeData.expertise && resumeData.expertise.length > 0 && (
        <div className="mb-1 relative group">
          {renderSectionToggle('expertise', sections.expertise)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            AREA OF EXPERTISE
          </h2>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/3">
              {resumeData.expertise.slice(0, Math.ceil(resumeData.expertise.length/3)).map((skill, index) => (
                <div key={index} className="mb-1 text-sm">
                  {renderEditableContent(
                    skill, 
                    onUpdateExpertise ? (value) => onUpdateExpertise(index, value) : undefined
                  )}
                  {renderSectionControls('expertise', index)}
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3">
              {resumeData.expertise.slice(Math.ceil(resumeData.expertise.length/3), Math.ceil(resumeData.expertise.length/3)*2).map((skill, index) => (
                <div key={index} className="mb-1 text-sm">
                  {renderEditableContent(
                    skill, 
                    onUpdateExpertise ? (value) => onUpdateExpertise(Math.ceil(resumeData.expertise.length/3) + index, value) : undefined
                  )}
                  {renderSectionControls('expertise', Math.ceil(resumeData.expertise.length/3) + index)}
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3">
              {resumeData.expertise.slice(Math.ceil(resumeData.expertise.length/3)*2).map((skill, index) => (
                <div key={index} className="mb-1 text-sm">
                  {renderEditableContent(
                    skill, 
                    onUpdateExpertise ? (value) => onUpdateExpertise(Math.ceil(resumeData.expertise.length/3)*2 + index, value) : undefined
                  )}
                  {renderSectionControls('expertise', Math.ceil(resumeData.expertise.length/3)*2 + index)}
                </div>
              ))}
            </div>
          </div>
          {renderSectionControls('expertise')}
        </div>
      )}

      {/* Key Achievements Section */}
      {sections.achievements && resumeData.achievements && resumeData.achievements.length > 0 && (
        <div className="mb-1 relative group">
          {renderSectionToggle('achievements', sections.achievements)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            KEY ACHIEVEMENTS
          </h2>
          <ul className="list-disc pl-5">
            {resumeData.achievements.map((achievement, index) => (
              <li key={index} className="mb-2 text-sm">
                <span className="font-bold">
                  {renderEditableContent(
                    achievement.title, 
                    onUpdateAchievement ? (value) => onUpdateAchievement(index, 'title', value) : undefined
                  )}.
                </span> 
                {renderEditableContent(
                  achievement.description, 
                  onUpdateAchievement ? (value) => onUpdateAchievement(index, 'description', value) : undefined
                )}
                {renderSectionControls('achievements', index)}
              </li>
            ))}
          </ul>
          {renderSectionControls('achievements')}
        </div>
      )}

      {/* Professional Experience Section */}
      {sections.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-1 relative group">
          {renderSectionToggle('experience', sections.experience)}
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
            PROFESSIONAL EXPERIENCE
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
      {sections.education && resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-1 relative group">
          {renderSectionToggle('education', sections.education)}
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
      {sections.additional && (
        <div className="mb-1 relative group">
          {renderSectionToggle('additional', sections.additional)}
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">
            ADDITIONAL INFORMATION
          </h2>
          
          {/* Languages Section */}
          {resumeData.languages.some(lang => lang) && (
            <div className="mb-1">
              <p className="text-sm"><span className="font-bold">Languages:</span> 
                {resumeData.languages.filter(l => l).map((lang, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      lang, 
                      onUpdateLanguage ? (value) => onUpdateLanguage(index, value) : undefined
                    )}
                    {renderSectionControls('languages', index)}
                  </span>
                ))}
              </p>
              {renderSectionControls('languages')}
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.some(cert => cert) && (
            <div className="mb-1">
              <p className="text-sm"><span className="font-bold">Certifications:</span> 
                {resumeData.certifications.filter(c => c).map((cert, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      cert, 
                      onUpdateCertification ? (value) => onUpdateCertification(index, value) : undefined
                    )}
                    {renderSectionControls('certifications', index)}
                  </span>
                ))}
              </p>
              {renderSectionControls('certifications')}
            </div>
          )}

          {/* Awards Section */}
          {resumeData.awards && resumeData.awards.some(award => award) && (
            <div className="mb-1">
              <p className="text-sm"><span className="font-bold">Awards/Activities:</span> 
                {resumeData.awards.filter(a => a).map((award, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {renderEditableContent(
                      award, 
                      onUpdateAward ? (value) => onUpdateAward(index, value) : undefined
                    )}
                    {renderSectionControls('awards', index)}
                  </span>
                ))}
              </p>
              {renderSectionControls('awards')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrimeSuiteTemplate;