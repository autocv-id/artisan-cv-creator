import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Save, 
  Upload,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Template } from '@/types/templates';
import ReactDOM from 'react-dom/client';
import React from 'react';

// Import template components
import AlphaTemplate from '@/components/resume/templates/AlphaTemplate';
import BravoTemplate from '@/components/resume/templates/BravoTemplate';
import CharlieTemplate from '@/components/resume/templates/CharlieTemplate';
import DeltaTemplate from '@/components/resume/templates/DeltaTemplate';

// Data dummy untuk template
const dummyResumeData = {
  personalInfo: {
    fullName: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '0812-3456-7890',
    location: 'Jakarta, Indonesia',
    title: 'Senior Front-End Developer',
    summary: 'Pengembang web berpengalaman dengan keahlian dalam React, TypeScript, dan UI/UX. Memiliki 5+ tahun pengalaman membangun aplikasi web yang responsif dan user-friendly.',
    website: 'www.budisantoso.dev',
  },
  experience: [
    { 
      id: 1, 
      company: 'PT Teknologi Maju', 
      position: 'Senior Front-End Developer', 
      startDate: 'Jan 2021', 
      endDate: 'Sekarang', 
      description: 'Memimpin tim front-end dalam pengembangan aplikasi e-commerce.\nMengimplementasikan arsitektur React yang skalabel dan dapat dipertahankan.\nMeningkatkan performa aplikasi sebesar 40% dengan optimasi rendering dan code splitting.' 
    },
    { 
      id: 2, 
      company: 'Startup Digital Indonesia', 
      position: 'Front-End Developer', 
      startDate: 'Mar 2018', 
      endDate: 'Dec 2020', 
      description: 'Mengembangkan UI komponen yang dapat digunakan kembali dengan React dan Styled Components.\nBekerja sama dengan tim desain untuk mengimplementasikan UI/UX yang konsisten.\nMengoptimalkan aplikasi untuk perangkat mobile dengan pendekatan responsive design.' 
    }
  ],
  education: [
    { 
      id: 1, 
      school: 'Universitas Indonesia', 
      degree: 'Sarjana', 
      field: 'Teknik Informatika', 
      startDate: 'Aug 2014', 
      endDate: 'Jul 2018', 
      description: 'GPA: 3.8/4.0\nAnggota aktif klub pemrograman kampus\nProyek akhir: Pengembangan aplikasi web untuk manajemen inventaris' 
    }
  ],
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Next.js'],
  languages: ['Indonesia (Native)', 'English (Professional)'],
  certifications: ['AWS Certified Developer', 'Google Professional Web Developer'],
  awards: ['Hackathon Nasional 2022 - Juara 1', 'Employee of the Year 2021'],
  expertise: ['Front-End Development', 'UI/UX Design', 'Responsive Design', 'Performance Optimization', 'Web Accessibility', 'State Management'],
  achievements: [
    {
      title: 'Peningkatan Performa',
      description: 'Meningkatkan waktu loading aplikasi sebesar 60% dengan implementasi lazy loading dan code splitting.'
    },
    {
      title: 'Pengembangan Komponen',
      description: 'Membangun library komponen UI yang digunakan di seluruh perusahaan, meningkatkan konsistensi dan kecepatan pengembangan.'
    }
  ]
};

// Type definition for the resume data structure
type ResumeDataType = typeof dummyResumeData;

// Type for error handling
type ErrorWithMessage = {
  message?: string;
};

// Fungsi untuk menentukan apakah template membutuhkan foto
const templateRequiresPhoto = (templateId: string): boolean => {
  // Template alpha tidak membutuhkan foto
  return templateId !== 'alpha';
};

// Tambahkan fungsi untuk membuat elemen dapat diedit
const EditableField = ({ 
  value, 
  onChange, 
  className = "", 
  isMultiline = false 
}: { 
  value: string, 
  onChange: (value: string) => void, 
  className?: string,
  isMultiline?: boolean 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLDivElement | HTMLSpanElement>(null);
  
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
    outline-none rounded px-1 transition-colors duration-150 ease-in-out
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

// Tambahkan komponen SectionManager
const SectionManager = ({
  sections,
  onToggle
}: {
  sections: Record<string, boolean>,
  onToggle: (section: string, visible: boolean) => void
}) => {
  const sectionNames: Record<string, string> = {
    summary: "Ringkasan",
    expertise: "Area Keahlian",
    achievements: "Pencapaian Utama",
    experience: "Pengalaman Profesional",
    education: "Pendidikan",
    additional: "Informasi Tambahan"
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-medium text-sm mb-2">Kelola Bagian Resume</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(sections).map(([section, isVisible]) => (
          <div key={section} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`section-${section}`}
              checked={isVisible}
              onChange={() => onToggle(section, !isVisible)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor={`section-${section}`} className="text-sm">
              {sectionNames[section] || section}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState<ResumeDataType>(dummyResumeData);
  const [currentTemplate, setCurrentTemplate] = useState('alpha');
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [userSubscription, setUserSubscription] = useState('free');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'alpha';

  // Fetch template data, user subscription status, and resume data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch template data
        const { data: templateData, error: templateError } = await supabase
          .rpc('get_template_by_id', { template_id: templateId })
          .single();

        if (templateError) {
          console.error('Error fetching template data:', templateError);
          
          // Fallback to direct query if RPC fails
          const { data: directTemplateData, error: directError } = await supabase
            .from('templates')
            .select('*')
            .eq('id', templateId)
            .single();
            
          if (directError) {
            console.error('Error with direct template query:', directError);
          } else if (directTemplateData) {
            setTemplateData(directTemplateData as Template);
            setCurrentTemplate(directTemplateData.id);
          }
        } else if (templateData) {
          setTemplateData(templateData as Template);
          setCurrentTemplate(templateData.id);
        }

        // Fetch user subscription status if logged in
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            setUserSubscription(profileData.subscription_status);
            
            // Check if user can access this template
            if (templateData && templateData.is_premium && profileData.subscription_status === 'free') {
              toast({
                title: "Premium Template",
                description: "This template is only available with a premium subscription. Using the default template instead.",
                variant: "destructive",
              });
              setCurrentTemplate('alpha');
            }
          }
        }

        // Fetch resume data if editing an existing resume
        if (id && id !== 'new' && user) {
          try {
            const { data, error } = await supabase
              .from('resumes')
              .select('*')
              .eq('id', id)
              .eq('user_id', user.id)
              .single();

            if (error) throw error;
            
            if (data) {
              setResumeTitle(data.title || 'Untitled Resume');
              
              // Check if template_id exists in the data
              if ('template_id' in data) {
                setCurrentTemplate(data.template_id || templateId);
              }
              
              // Set resume data if it exists
              if (data.content && typeof data.content === 'object') {
                setResumeData(data.content as ResumeDataType);
              }
            }
          } catch (error: unknown) {
            const errorWithMessage = error as ErrorWithMessage;
            toast({
              title: "Error fetching resume",
              description: errorWithMessage.message || "Failed to load resume data",
              variant: "destructive",
            });
          }
        }
      } catch (error: unknown) {
        const errorWithMessage = error as ErrorWithMessage;
        toast({
          title: "Error loading data",
          description: errorWithMessage.message || "Failed to load necessary data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user, toast, templateId]);

  // Handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPhotoUrl(objectUrl);
      
      toast({
        title: "Photo added",
        description: "Your photo has been added to the resume.",
      });
    } catch (error: unknown) {
      const errorWithMessage = error as ErrorWithMessage;
      toast({
        title: "Upload failed",
        description: errorWithMessage.message || "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  // Handle field edit
  const handleFieldEdit = (section: keyof ResumeDataType, field: string, value: string) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      if (section === 'personalInfo') {
        newData.personalInfo = {
          ...newData.personalInfo,
          [field]: value
        };
      }
      
      return newData;
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login to save your resume",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Get the current state of the resume from the DOM
      const resumeContent = resumeRef.current?.innerHTML;
      
      // Determine if we're creating a new resume or updating an existing one
      if (id && id !== 'new') {
        // Update existing resume
        const { error } = await supabase
          .from('resumes')
          .update({
            title: resumeTitle,
            content: resumeData,
            template_id: currentTemplate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new resume
        const { error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: resumeTitle,
            content: resumeData,
            template_id: currentTemplate,
          });

        if (error) throw error;
      }

      toast({
        title: "Resume saved!",
        description: "Your resume has been saved successfully.",
      });

      // Redirect to dashboard after saving a new resume
      if (id === 'new') {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const errorWithMessage = error as ErrorWithMessage;
      toast({
        title: "Error saving resume",
        description: errorWithMessage.message || "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle download PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Buat elemen sementara untuk rendering PDF yang bersih
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Render template dengan font yang jelas dan aman untuk PDF
      const cleanTemplate = document.createElement('div');
      cleanTemplate.className = 'pdf-ready bg-white p-8';
      cleanTemplate.style.width = '21cm';
      cleanTemplate.style.minHeight = '29.7cm';
      
      // Clone resumeData dan filter hanya section yang visible
      const visibleSections = resumeData.sections || {
        summary: true,
        expertise: true,
        achievements: true,
        experience: true,
        education: true,
        additional: true
      };
      
      const filteredResumeData = {
        ...resumeData,
        sections: visibleSections
      };
      
      // Tambahkan CSS yang memastikan font dirender dengan benar
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .pdf-ready {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          line-height: 1.5;
          letter-spacing: normal;
          font-feature-settings: normal;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        .pdf-ready * {
          letter-spacing: normal;
          word-spacing: normal;
          text-rendering: optimizeLegibility;
        }
        .pdf-ready h1 {
          font-size: 24px;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: normal;
        }
        .pdf-ready h2 {
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: normal;
        }
        .pdf-ready h3 {
          font-size: 16px;
          margin-bottom: 6px;
          font-weight: 600;
          letter-spacing: normal;
        }
        .pdf-ready p {
          margin-bottom: 6px;
          font-size: 14px;
        }
        .pdf-ready ul {
          margin-top: 6px;
          margin-bottom: 12px;
        }
        .pdf-ready li {
          margin-bottom: 4px;
          font-size: 14px;
        }
        .pdf-ready .mb-6 {
          margin-bottom: 24px;
        }
        .pdf-ready .mb-4 {
          margin-bottom: 16px;
        }
        .pdf-ready .mb-2 {
          margin-bottom: 8px;
        }
        .pdf-ready .text-sm {
          font-size: 14px;
          letter-spacing: normal;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Render template ke dalam div sementara
      tempDiv.appendChild(cleanTemplate);
      
      // Tunggu hingga font dimuat
      await document.fonts.ready;
      
      // Render komponen dengan ReactDOM
      const reactRoot = ReactDOM.createRoot(cleanTemplate);
      reactRoot.render(
        <React.StrictMode>
          {currentTemplate === 'alpha' ? (
            <AlphaTemplate resumeData={filteredResumeData} />
          ) : currentTemplate === 'bravo' ? (
            <BravoTemplate resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          ) : currentTemplate === 'charlie' ? (
            <CharlieTemplate resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          ) : (
            <DeltaTemplate resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          )}
        </React.StrictMode>
      );
      
      // Tunggu lebih lama agar rendering selesai dan font dimuat
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gunakan pengaturan html2canvas yang lebih baik untuk font
      const pdfOptions = {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true, // Penting untuk rendering teks yang benar
        backgroundColor: '#ffffff',
        fontFaces: [
          {
            family: 'Inter',
            weight: '400'
          },
          {
            family: 'Inter',
            weight: '500'
          },
          {
            family: 'Inter',
            weight: '600'
          },
          {
            family: 'Inter',
            weight: '700'
          }
        ]
      };
      
      const canvas = await html2canvas(cleanTemplate, pdfOptions);
      
      // Buat PDF dengan kualitas lebih tinggi
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // A4 size: 210mm x 297mm
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: false // Hindari kompresi yang bisa merusak kualitas
      });
      
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // Simpan PDF dengan nama yang sesuai
      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}.pdf`);
      
      // Bersihkan elemen sementara
      document.body.removeChild(tempDiv);
      document.head.removeChild(styleElement);
      
      toast({
        title: "PDF berhasil dibuat",
        description: "Resume Anda telah berhasil didownload",
      });
      
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast({
        title: "Gagal membuat PDF",
        description: "Terjadi kesalahan saat membuat PDF. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Fungsi untuk mengupdate data personal
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Fungsi untuk mengupdate experience
  const updateExperience = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Fungsi untuk mengupdate education
  const updateEducation = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Fungsi untuk mengupdate skills
  const updateSkill = (index: number, value: string) => {
    setResumeData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  // Fungsi untuk mengupdate languages
  const updateLanguage = (index: number, value: string) => {
    setResumeData(prev => {
      const newLanguages = [...prev.languages];
      newLanguages[index] = value;
      return { ...prev, languages: newLanguages };
    });
  };

  // Fungsi untuk mengupdate certifications
  const updateCertification = (index: number, value: string) => {
    setResumeData(prev => {
      const newCertifications = [...(prev.certifications || [])];
      newCertifications[index] = value;
      return { ...prev, certifications: newCertifications };
    });
  };

  // Fungsi untuk mengupdate awards
  const updateAward = (index: number, value: string) => {
    setResumeData(prev => {
      const newAwards = [...(prev.awards || [])];
      newAwards[index] = value;
      return { ...prev, awards: newAwards };
    });
  };

  // Fungsi untuk mengupdate expertise
  const updateExpertise = (index: number, value: string) => {
    setResumeData(prev => {
      const newExpertise = [...(prev.expertise || [])];
      newExpertise[index] = value;
      return { ...prev, expertise: newExpertise };
    });
  };

  // Fungsi untuk mengupdate achievements
  const updateAchievement = (index: number, field: 'title' | 'description', value: string) => {
    setResumeData(prev => {
      const newAchievements = [...(prev.achievements || [])];
      if (newAchievements[index]) {
        newAchievements[index] = {
          ...newAchievements[index],
          [field]: value
        };
      }
      return { ...prev, achievements: newAchievements };
    });
  };

  // Tambahkan fungsi untuk toggle section visibility
  const toggleSectionVisibility = (section: string, visible: boolean) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...(prev.sections || {
          summary: true,
          expertise: true,
          achievements: true,
          experience: true,
          education: true,
          additional: true
        }),
        [section]: visible
      }
    }));
  };

  // Komponen template yang dapat diedit
  const EditableResumeTemplate = () => {
    // Render template berdasarkan jenis yang dipilih
    switch (currentTemplate) {
      case 'alpha':
        return (
          <div className="relative">
            <div id="resume-preview" ref={resumeRef}>
              <AlphaTemplate 
                resumeData={resumeData} 
                isEditable={true}
                onSectionToggle={toggleSectionVisibility}
              />
            </div>
          </div>
        );
      case 'bravo':
        return (
          <div className="relative">
            <div id="resume-preview" ref={resumeRef}>
              <BravoTemplate 
                resumeData={resumeData} 
                photoUrl={photoUrl || undefined}
                isEditable={true}
                onSectionToggle={toggleSectionVisibility}
              />
            </div>
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-300 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-auto">
                Klik untuk mengedit
              </div>
            </div>
          </div>
        );
      case 'charlie':
        return (
          <div className="relative">
            <div id="resume-preview" ref={resumeRef}>
              <CharlieTemplate 
                resumeData={resumeData} 
                photoUrl={photoUrl || undefined}
                isEditable={true}
                onSectionToggle={toggleSectionVisibility}
              />
            </div>
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-300 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-auto">
                Klik untuk mengedit
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative">
            <div id="resume-preview" ref={resumeRef}>
              <DeltaTemplate 
                resumeData={resumeData} 
                photoUrl={photoUrl || undefined}
                isEditable={true}
                onSectionToggle={toggleSectionVisibility}
              />
            </div>
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-300 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-auto">
                Klik untuk mengedit
              </div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <Layout withFooter={false}>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout withFooter={false}>
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-resume-primary">Resume Editor</h1>
            <div className="flex items-center space-x-2">
              <Input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="max-w-xs"
                placeholder="Resume Title"
              />
              {templateData && (
                <Badge variant="outline" className="ml-2 text-sm">
                  Template: {templateData.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {templateRequiresPhoto(currentTemplate) && (
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex gap-2 items-center"
              >
                <Camera className="h-4 w-4" />
                Upload Photo
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleSave} 
              className="flex gap-2 items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              className="flex gap-2 items-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-primary rounded-full" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PDF
            </Button>
            <Link to="/dashboard">
              <Button variant="secondary" className="flex gap-2 items-center">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Petunjuk:</strong> Klik langsung pada bagian resume yang ingin Anda edit. Semua perubahan akan langsung terlihat pada template.
            </p>
          </Card>
        </div>

        <SectionManager 
          sections={resumeData.sections || {
            summary: true,
            expertise: true,
            achievements: true,
            experience: true,
            education: true,
            additional: true
          }} 
          onToggle={toggleSectionVisibility} 
        />

        <div className="flex justify-center">
          <div className="w-full max-w-[21cm] shadow-lg">
            <EditableResumeTemplate />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeEditor;
