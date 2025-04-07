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
  technicalSkills?: string[];
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

interface ExecutiveEdgeProps {
  resumeData: ResumeDataType;
  photoUrl?: string;
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
  onPhotoUpload?: (file: File) => void;
  // Tambahkan fungsi untuk menambah dan menghapus item
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
  // Initialize section status if not present
  const sections = resumeData.sections || {
    summary: true,
    expertise: false,
    achievements: false,
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
        aria-label={`Remove ${section}`}
      >
        - Remove
      </button>
    ) : null;
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onPhotoUpload) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  // State for contact info dropdown
  const [showContactMenu, setShowContactMenu] = React.useState(false);

  return (
    <div className="bg-white text-gray-800 p-8 max-w-[21cm] mx-auto">
      {/* Header with photo */}
      <div className="flex mb-6">
        {/* Photo section */}
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
        
        {/* Contact information */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900">
            {renderEditableContent(
              resumeData.personalInfo.fullName || 'YOUR NAME',
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('fullName', value) : undefined,
              false,
              "font-bold"
            )}
          </h1>
          
          <div className="mt-4 grid grid-cols-[100px_1fr] gap-y-1">
            <div className="font-bold">Address:</div>
            <div>
              {renderEditableContent(
                resumeData.personalInfo.location || 'Your Address',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('location', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Phone:</div>
            <div>
              {renderEditableContent(
                resumeData.personalInfo.phone || 'Your Phone',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('phone', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Email:</div>
            <div>
              {renderEditableContent(
                resumeData.personalInfo.email || 'Your Email',
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('email', value) : undefined
              )}
            </div>
            
            {resumeData.personalInfo.website && (
              <>
                <div className="font-bold">Website:</div>
                <div>
                  {renderEditableContent(
                    resumeData.personalInfo.website,
                    onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('website', value) : undefined
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Add Contact Info Button */}
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

      {/* Summary Section */}
      {sections.summary && resumeData.personalInfo.summary && (
        <div className="mb-6 relative group">
          {renderSectionToggle('summary', sections.summary)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
          <p className="text-sm">
            {renderEditableContent(
              resumeData.personalInfo.summary,
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('summary', value) : undefined,
              true
            )}
          </p>
        </div>
      )}

      {/* Work Experience Section */}
      {sections.experience && resumeData.experience.length > 0 && resumeData.experience.some(exp => exp.company) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('experience', sections.experience)}
          <h2 className="text-xl font-bold  text-blue-900 border-b border-gray-300 pb-1 mb-2">
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
      {sections.education && resumeData.education.length > 0 && resumeData.education.some(edu => edu.school) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('education', sections.education)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
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
        <div className="mb-6 relative group">
          {renderSectionToggle('additional', sections.additional)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">ADDITIONAL INFORMATION</h2>
          
          {/* Technical Skills Section */}
          {resumeData.technicalSkills && resumeData.technicalSkills.length > 0 && (
            <div className="mb-2">
              <p className="text-sm"><span className="font-bold">Technical Skills:</span> 
                {resumeData.technicalSkills.map((skill, index) => (
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
          
          {/* Languages Section */}
          {resumeData.languages.some(lang => lang) && (
            <div className="mb-2">
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
                {renderSectionControls('languages')}
              </p>
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.some(cert => cert) && (
            <div className="mb-2">
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
                {renderSectionControls('certifications')}
              </p>
            </div>
          )}

          {/* Awards Section */}
          {resumeData.awards && resumeData.awards.some(award => award) && (
            <div className="mb-2">
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