import React from 'react';
import { ResumeData } from '@/types/resume';

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

interface CorporateBlueProps {
  resumeData: ResumeData;
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

const CorporateBlue: React.FC<CorporateBlueProps> = ({ 
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
        <button 
          onClick={() => onAddItem(section)}
          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors mt-2"
          aria-label={`Add ${section}`}
        >
          + Add
        </button>
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
              resumeData.basics.name,
              onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('name', value) : undefined
            )}
          </h1>
          
          <div className="mt-4 grid grid-cols-[100px_1fr] gap-y-1">
            <div className="font-bold">Address:</div>
            <div>
              {renderEditableContent(
                `${resumeData.basics.location.address}, ${resumeData.basics.location.city}, ${resumeData.basics.location.region} ${resumeData.basics.location.postalCode}`,
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('location', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Phone:</div>
            <div>
              {renderEditableContent(
                resumeData.basics.phone,
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('phone', value) : undefined
              )}
            </div>
            
            <div className="font-bold">Email:</div>
            <div>
              {renderEditableContent(
                resumeData.basics.email,
                onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('email', value) : undefined
              )}
            </div>
            
            {resumeData.basics.url && (
              <>
                <div className="font-bold">Website:</div>
                <div>
                  {renderEditableContent(
                    resumeData.basics.url,
                    onUpdatePersonalInfo ? (value) => onUpdatePersonalInfo('url', value) : undefined
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Summary Section */}
      {resumeData.basics.summary && (
        <div className="mb-6 relative group">
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
          <p className="text-sm">
            {renderEditableContent(
              resumeData.basics.summary,
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
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
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

      {/* Skills Section */}
      {sections.skills && resumeData.skills.length > 0 && (
            <div className="mb-6 relative group">
          {renderSectionToggle('skills', sections.skills)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
            SKILLS
          </h2>
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
          {renderSectionControls('skills')}
            </div>
          )}
          
      {/* Languages Section */}
      {sections.languages && resumeData.languages.some(lang => lang) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('languages', sections.languages)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resumeData.languages.filter(l => l).map((lang, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm">
                  {renderEditableContent(
                    lang,
                    onUpdateLanguage ? (value) => onUpdateLanguage(index, value) : undefined
                  )}
                </span>
                {renderSectionControls('languages', index)}
              </div>
            ))}
          </div>
          {renderSectionControls('languages')}
                </div>
              )}
              
      {/* Certifications Section */}
      {sections.certifications && resumeData.certifications.some(cert => cert) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('certifications', sections.certifications)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
            CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {resumeData.certifications.filter(c => c).map((cert, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm">
                  {renderEditableContent(
                    cert,
                    onUpdateCertification ? (value) => onUpdateCertification(index, value) : undefined
                  )}
                </span>
                {renderSectionControls('certifications', index)}
              </div>
            ))}
          </div>
          {renderSectionControls('certifications')}
                </div>
              )}
              
      {/* Awards Section */}
      {sections.awards && resumeData.awards.some(award => award) && (
        <div className="mb-6 relative group">
          {renderSectionToggle('awards', sections.awards)}
          <h2 className="text-xl font-bold text-blue-900 border-b border-gray-300 pb-1 mb-2">
            AWARDS & ACHIEVEMENTS
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {resumeData.awards.filter(a => a).map((award, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm">
                  {renderEditableContent(
                    award,
                    onUpdateAward ? (value) => onUpdateAward(index, value) : undefined
                  )}
                </span>
                {renderSectionControls('awards', index)}
              </div>
            ))}
                </div>
          {renderSectionControls('awards')}
        </div>
      )}
    </div>
  );
};

export default CorporateBlue; 