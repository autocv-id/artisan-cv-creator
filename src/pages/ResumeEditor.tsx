import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Save, 
  Upload,
  Camera,
  Eye,
  Settings,
  Printer,
  Edit,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2
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
import PrimeSuiteTemplate from '@/components/resume/profesional/templates/primesuite';
import ExecutiveEdge from '@/components/resume/profesional/templates/ExecutiveEdge';
import CorporateBlue from '@/components/resume/profesional/templates/CorporateBlue';
import FormalFocus from '@/components/resume/profesional/templates/FormalFocus';

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
  ],
  sections: {
    summary: true,
    expertise: true,
    achievements: true,
    experience: true,
    education: true,
    additional: true
  }
};

// Type definition for the resume data structure
type ResumeDataType = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website: string;
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
};

// Type for error handling
type ErrorWithMessage = {
  message?: string;
};

// Fungsi untuk menentukan apakah template membutuhkan foto
const templateRequiresPhoto = (templateId: string): boolean => {
  // Template prime-suite tidak membutuhkan foto
  return templateId !== 'prime-suite';
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
    <Card className="p-4 mb-4 bg-white shadow-sm">
      <h3 className="font-medium text-sm mb-3 text-gray-700">Kelola Bagian Resume</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(sections).map(([section, isVisible]) => (
          <div key={section} className="flex items-center space-x-2 bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id={`section-${section}`}
              checked={isVisible}
              onChange={() => onToggle(section, !isVisible)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor={`section-${section}`} className="text-sm text-gray-700 cursor-pointer">
              {sectionNames[section] || section}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Tambahkan komponen EditorToolbar baru
const EditorToolbar = ({
  onAddItem,
  activeSection
}: {
  onAddItem: (section: string) => void;
  activeSection: string;
}) => {
  const sectionButtonsMap: Record<string, { label: string, section: string }[]> = {
    personal: [],
    experience: [{ label: "Tambah Pengalaman", section: "experience" }],
    education: [{ label: "Tambah Pendidikan", section: "education" }],
    skills: [
      { label: "Tambah Keterampilan", section: "skills" },
      { label: "Tambah Bahasa", section: "languages" },
      { label: "Tambah Keahlian", section: "expertise" }
    ],
    awards: [
      { label: "Tambah Penghargaan", section: "awards" },
      { label: "Tambah Sertifikasi", section: "certifications" },
      { label: "Tambah Pencapaian", section: "achievements" }
    ]
  };

  const buttons = sectionButtonsMap[activeSection] || [];

  return buttons.length > 0 ? (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-2 mb-4 flex flex-wrap gap-2">
      {buttons.map((btn, idx) => (
        <Button 
          key={idx} 
          variant="outline" 
          size="sm" 
          onClick={() => onAddItem(btn.section)}
          className="flex items-center gap-1 text-xs"
        >
          <Plus className="h-3 w-3" /> {btn.label}
        </Button>
      ))}
    </div>
  ) : null;
};

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState<ResumeDataType>(dummyResumeData);
  const [currentTemplate, setCurrentTemplate] = useState('prime-suite');
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [userSubscription, setUserSubscription] = useState('free');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [activeEditorSection, setActiveEditorSection] = useState('personal');
  const [editorZoom, setEditorZoom] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'prime-suite';

  // Fetch template data, user subscription status, and resume data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch template data
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError) {
          console.error('Error fetching template data:', templateError);
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
              setCurrentTemplate('prime-suite');
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

  // Improved PDF download function for better quality and pagination
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
      cleanTemplate.className = 'pdf-ready bg-white';
      cleanTemplate.style.width = '21cm';
      cleanTemplate.style.minHeight = '29.7cm';
      cleanTemplate.style.padding = '1.5cm';
      cleanTemplate.style.boxSizing = 'border-box';
      
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
          overflow: hidden;
          break-inside: avoid;
        }
        .pdf-ready * {
          letter-spacing: normal;
          word-spacing: normal;
          text-rendering: optimizeLegibility;
          page-break-inside: avoid;
        }
        .pdf-ready h1 {
          font-size: 24px;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: normal;
          page-break-after: avoid;
        }
        .pdf-ready h2 {
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: normal;
          page-break-after: avoid;
        }
        .pdf-ready h3 {
          font-size: 16px;
          margin-bottom: 6px;
          font-weight: 600;
          letter-spacing: normal;
          page-break-after: avoid;
        }
        .pdf-ready p {
          margin-bottom: 6px;
          font-size: 14px;
          orphans: 3;
          widows: 3;
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
        .pdf-ready section {
          page-break-inside: avoid;
        }
        .pdf-ready hr {
          page-break-after: always;
        }
        .pdf-ready .page-break {
          page-break-before: always;
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
          {currentTemplate === 'prime-suite' ? (
            <PrimeSuiteTemplate resumeData={filteredResumeData} />
          ) : currentTemplate === 'executive-edge' ? (
            <ExecutiveEdge resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          ) : currentTemplate === 'corporate-blue' ? (
            <CorporateBlue resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          ) : currentTemplate === 'formal-focus' ? (
            <FormalFocus resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          ) : (
            <FormalFocus resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />
          )}
        </React.StrictMode>
      );
      
      // Tunggu lebih lama agar rendering selesai dan font dimuat
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Gunakan jsPDF dengan pengaturan yang lebih baik
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        hotfixes: ["px_scaling"]
      });
      
      // Konfigurasi untuk html2canvas
      const scale = 2; // Higher scale for better quality
      const pdfOptions = {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        width: cleanTemplate.offsetWidth * scale,
        height: cleanTemplate.offsetHeight * scale
      };
      
      // Mendapatkan canvas dari template
      const canvas = await html2canvas(cleanTemplate, pdfOptions);
      
      // Ukuran A4 dalam milimeter
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Mendapatkan dimensi dari canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Menghitung rasio untuk mempertahankan aspek rasio
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Menghitung dimensi akhir
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      // Mengkonversi canvas ke gambar
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Check jika konten lebih tinggi dari halaman A4 tunggal
      const pdfContentHeight = (imgHeight * pdfWidth) / imgWidth;
      
      if (pdfContentHeight > pdfHeight) {
        // Konten terlalu tinggi untuk satu halaman, buat multi-halaman PDF
        
        // Buat canvas baru yang lebih besar untuk menangani konten lebih banyak
        const multiPageCanvas = document.createElement('canvas');
        const ctx = multiPageCanvas.getContext('2d');
        
        if (ctx) {
          // Tentukan tinggi per halaman (dalam piksel canvas)
          const pageHeight = (pdfHeight * imgWidth) / pdfWidth;
          const totalPages = Math.ceil(imgHeight / pageHeight);
          
          // Untuk setiap halaman
          for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
              pdf.addPage();
            }
            
            // Hitung bagian dari gambar untuk halaman ini
            const sourceY = page * pageHeight;
            let sourceHeight = pageHeight;
            
            // Cek jika ini halaman terakhir dan mungkin tidak penuh
            if (sourceY + sourceHeight > imgHeight) {
              sourceHeight = imgHeight - sourceY;
            }
            
            // Buat canvas untuk halaman ini
            multiPageCanvas.width = imgWidth;
            multiPageCanvas.height = sourceHeight;
            
            // Gambar bagian yang sesuai dari canvas asli
            ctx.drawImage(
              canvas, 
              0, sourceY, imgWidth, sourceHeight, 
              0, 0, imgWidth, sourceHeight
            );
            
            // Dapatkan data gambar dari canvas halaman ini
            const pageData = multiPageCanvas.toDataURL('image/jpeg', 1.0);
            
            // Tambahkan ke PDF
            pdf.addImage(
              pageData, 
              'JPEG', 
              0, 0, 
              pdfWidth, (sourceHeight * pdfWidth) / imgWidth, 
              '', 
              'FAST'
            );
          }
        }
      } else {
        // Konten muat dalam satu halaman
        pdf.addImage(
          imgData, 
          'JPEG', 
          0, 0, 
          finalWidth, finalHeight, 
          '', 
          'FAST'
        );
      }
      
      // Simpan PDF dengan nama yang sesuai
      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}.pdf`);
      
      // Bersihkan elemen sementara
      document.body.removeChild(tempDiv);
      document.head.removeChild(styleElement);
      
      toast({
        title: "PDF berhasil dibuat",
        description: "Resume Anda telah berhasil didownload dengan kualitas yang lebih baik.",
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

  // Fungsi untuk menambah item baru di setiap section
  const addItem = (section: string) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      switch (section) {
        case 'experience': {
          const newExpId = prev.experience.length > 0 
            ? Math.max(...prev.experience.map(exp => exp.id)) + 1 
            : 1;
          newData.experience = [
            ...prev.experience, 
            { 
              id: newExpId, 
              company: 'Nama Perusahaan', 
              position: 'Jabatan', 
              startDate: 'Tanggal Mulai', 
              endDate: 'Tanggal Selesai', 
              description: 'Deskripsi pekerjaan' 
            }
          ];
          break;
        }
        case 'education': {
          const newEduId = prev.education.length > 0 
            ? Math.max(...prev.education.map(edu => edu.id)) + 1 
            : 1;
          newData.education = [
            ...prev.education, 
            { 
              id: newEduId, 
              school: 'Nama Sekolah/Universitas', 
              degree: 'Gelar', 
              field: 'Bidang Studi', 
              startDate: 'Tanggal Mulai', 
              endDate: 'Tanggal Selesai', 
              description: 'Deskripsi pendidikan' 
            }
          ];
          break;
        }
        case 'skills':
          newData.skills = [...prev.skills, 'Keterampilan Baru'];
          break;
        case 'languages':
          newData.languages = [...prev.languages, 'Bahasa Baru'];
          break;
        case '
