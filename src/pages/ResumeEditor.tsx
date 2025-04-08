import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Save, 
  Camera,
  Plus,
  ArrowLeft,
  Minus,
  ZoomIn,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Template } from '@/types/templates';
import { ResumeDataType, convertToResumeData, convertToResumeDataType } from '@/types/resume';

// Import refactored components
import ResumePreview from '@/components/resume/ResumePreview';
import SectionManager from '@/components/resume/SectionManager';
import EditorToolbar from '@/components/resume/EditorToolbar';
import PersonalInfoForm from '@/components/resume/form/PersonalInfoForm';
import ExperienceForm from '@/components/resume/form/ExperienceForm';
import EducationForm from '@/components/resume/form/EducationForm';
import SkillsForm from '@/components/resume/form/SkillsForm';
import AwardsForm from '@/components/resume/form/AwardsForm';
import { generateResumePDF } from '@/utils/resumePdfExport';

const dummyResumeData: ResumeDataType = {
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

type ErrorWithMessage = {
  message?: string;
};

const templateRequiresPhoto = (templateId: string): boolean => {
  return templateId !== 'prime-suite';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching resume data with ID:", id);
        console.log("Current user:", user?.id);
        
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (templateError) {
          console.error('Error fetching template data:', templateError);
          toast({
            title: "Error loading template",
            description: "We couldn't load the template. Using default template instead.",
            variant: "destructive",
          });
        } else if (templateData) {
          console.log("Template data loaded:", templateData.id);
          setTemplateData(templateData as Template);
          setCurrentTemplate(templateData.id);
        }

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            console.log("User profile loaded:", profileData.subscription_status);
            setUserSubscription(profileData.subscription_status);
            
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

        if (id && id !== 'new' && user) {
          try {
            console.log("Fetching resume with ID:", id);
            
            const { data, error } = await supabase
              .from('resumes')
              .select('*')
              .eq('id', id)
              .eq('user_id', user.id)
              .single();

            if (error) {
              console.error("Failed to fetch resume:", error);
              throw error;
            }
            
            if (data) {
              console.log("Resume data loaded successfully");
              setResumeTitle(data.title || 'Untitled Resume');
              
              if ('template_id' in data) {
                console.log("Setting template ID from resume:", data.template_id);
                setCurrentTemplate(data.template_id || templateId);
              }
              
              if (data.content) {
                console.log("Content data type:", typeof data.content);
                
                // Safe handling of content data
                let parsedContent;
                try {
                  // If content is a string (probably JSON), parse it
                  if (typeof data.content === 'string') {
                    parsedContent = JSON.parse(data.content);
                    console.log("Parsed string content to object");
                  } else if (typeof data.content === 'object') {
                    parsedContent = data.content;
                    console.log("Content is already an object");
                  } else {
                    throw new Error("Invalid content format");
                  }
                  
                  // Convert to our internal format if needed
                  if ('basics' in parsedContent) {
                    console.log("Converting from ResumeData format to ResumeDataType");
                    const converted = convertToResumeDataType(parsedContent);
                    setResumeData(converted);
                  } else if ('personalInfo' in parsedContent) {
                    console.log("Using ResumeDataType format directly");
                    setResumeData(parsedContent);
                  } else {
                    console.error("Unknown resume data format:", parsedContent);
                    throw new Error("Unknown resume data format");
                  }
                } catch (parseError) {
                  console.error("Error parsing or converting resume content:", parseError);
                  toast({
                    title: "Data format error",
                    description: "We had trouble reading your resume data. Using default template instead.",
                    variant: "destructive",
                  });
                  setResumeData(dummyResumeData);
                }
              } else {
                console.error("Resume content is missing");
                toast({
                  title: "Invalid resume data",
                  description: "The resume data appears to be corrupted. Using default template.",
                  variant: "destructive",
                });
                // Use default data as fallback
                setResumeData(dummyResumeData);
              }
            } else {
              console.error("No resume data found for ID:", id);
              toast({
                title: "Resume not found",
                description: "We couldn't find this resume in your account.",
                variant: "destructive",
              });
              // Navigate to dashboard after a delay
              setTimeout(() => navigate('/dashboard'), 2000);
            }
          } catch (error: unknown) {
            const errorWithMessage = error as ErrorWithMessage;
            console.error("Error in resume fetch:", errorWithMessage);
            toast({
              title: "Error fetching resume",
              description: errorWithMessage.message || "Failed to load resume data",
              variant: "destructive",
            });
            // Use default data as fallback
            setResumeData(dummyResumeData);
          }
        } else if (id === 'new') {
          console.log("Creating new resume with default data");
          // For new resumes, we use the dummy data
          setResumeData(dummyResumeData);
        }
      } catch (error: unknown) {
        const errorWithMessage = error as ErrorWithMessage;
        console.error("Global error in fetchData:", errorWithMessage);
        toast({
          title: "Error loading data",
          description: errorWithMessage.message || "Failed to load necessary data",
          variant: "destructive",
        });
        // Use default data as fallback
        setResumeData(dummyResumeData);
      } finally {
        setIsLoading(false);
        console.log("Finished loading data");
      }
    };

    fetchData();
  }, [id, user, toast, templateId, navigate]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
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
      // Serialize content to ensure proper storage in Supabase
      const apiResumeData = convertToResumeData(resumeData);
      
      // Explicitly convert data to JSON format that Supabase expects
      const jsonContent = JSON.parse(JSON.stringify(apiResumeData));
      console.log("Saving resume data:", { title: resumeTitle, template: currentTemplate });
      
      if (id && id !== 'new') {
        console.log("Updating existing resume with ID:", id);
        const { error } = await supabase
          .from('resumes')
          .update({
            title: resumeTitle,
            content: jsonContent,
            template_id: currentTemplate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error updating resume:", error);
          throw error;
        }
        
        console.log("Resume updated successfully");
      } else {
        console.log("Creating new resume");
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: resumeTitle,
            content: jsonContent,
            template_id: currentTemplate,
          })
          .select();

        if (error) {
          console.error("Error creating resume:", error);
          throw error;
        }
        
        console.log("New resume created with data:", data);
      }

      toast({
        title: "Resume saved!",
        description: "Your resume has been saved successfully.",
      });

      if (id === 'new') {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const errorWithMessage = error as ErrorWithMessage;
      console.error("Error in handleSave:", errorWithMessage);
      toast({
        title: "Error saving resume",
        description: errorWithMessage.message || "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      await generateResumePDF(resumeData, currentTemplate, photoUrl, resumeTitle);
      
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

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const updateLanguage = (index: number, value: string) => {
    setResumeData(prev => {
      const newLanguages = [...prev.languages];
      newLanguages[index] = value;
      return { ...prev, languages: newLanguages };
    });
  };

  const updateCertification = (index: number, value: string) => {
    setResumeData(prev => {
      const newCertifications = [...(prev.certifications || [])];
      newCertifications[index] = value;
      return { ...prev, certifications: newCertifications };
    });
  };

  const updateAward = (index: number, value: string) => {
    setResumeData(prev => {
      const newAwards = [...(prev.awards || [])];
      newAwards[index] = value;
      return { ...prev, awards: newAwards };
    });
  };

  const updateExpertise = (index: number, value: string) => {
    setResumeData(prev => {
      const newExpertise = [...(prev.expertise || [])];
      newExpertise[index] = value;
      return { ...prev, expertise: newExpertise };
    });
  };

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
        case 'expertise':
          newData.expertise = [...(prev.expertise || []), 'Area Keahlian Baru'];
          break;
        case 'certifications':
          newData.certifications = [...(prev.certifications || []), 'Sertifikasi Baru'];
          break;
        case 'awards':
          newData.awards = [...(prev.awards || []), 'Penghargaan Baru'];
          break;
        case 'achievements':
          newData.achievements = [
            ...(prev.achievements || []),
            {
              title: 'Judul Pencapaian',
              description: 'Deskripsi pencapaian dan dampak yang dihasilkan.'
            }
          ];
          break;
        default:
          break;
      }
      
      return newData;
    });
  };

  const removeItem = (section: string, index: number) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      switch (section) {
        case 'experience':
          newData.experience = prev.experience.filter((_, i) => i !== index);
          break;
        case 'education':
          newData.education = prev.education.filter((_, i) => i !== index);
          break;
        case 'skills':
          newData.skills = prev.skills.filter((_, i) => i !== index);
          break;
        case 'languages':
          newData.languages = prev.languages.filter((_, i) => i !== index);
          break;
        case 'expertise':
          if (prev.expertise) {
            newData.expertise = prev.expertise.filter((_, i) => i !== index);
          }
          break;
        case 'certifications':
          if (prev.certifications) {
            newData.certifications = prev.certifications.filter((_, i) => i !== index);
          }
          break;
        case 'awards':
          if (prev.awards) {
            newData.awards = prev.awards.filter((_, i) => i !== index);
          }
          break;
        case 'achievements':
          if (prev.achievements) {
            newData.achievements = prev.achievements.filter((_, i) => i !== index);
          }
          break;
      }
      
      return newData;
    });
  };

  const toggleSection = (section: string, visible: boolean) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: visible
      }
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 lg:px-6 lg:py-6">
        {/* Error handling - show fallback UI if problems occur */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Memuat resume Anda...</p>
          </div>
        ) : (
          <>
            {/* Header section with back button, title and action buttons */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/dashboard')}
                    className="h-9 w-9 rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Input
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    className="max-w-[300px] text-lg font-medium border-none focus-visible:ring-transparent pl-0"
                    placeholder="Untitled Resume"
                  />
                  {isSaving && (
                    <span className="text-sm text-muted-foreground animate-pulse">Menyimpan...</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!templateRequiresPhoto(currentTemplate)}
                    className="flex items-center gap-1 h-9"
                  >
                    <Camera className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Tambah Foto</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-1 h-9"
                  >
                    <Download className="h-4 w-4" /> 
                    <span className="hidden sm:inline">
                      {isDownloading ? 'Mengunduh...' : 'Unduh PDF'}
                    </span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 h-9"
                  >
                    <Save className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Simpan</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main content with editor and preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Editor section */}
              <div className="lg:col-span-4 xl:col-span-4 order-2 lg:order-1">
                <div className="sticky top-20 space-y-4">
                  <Card className="overflow-hidden shadow-sm border">
                    <Tabs value={activeEditorSection} onValueChange={setActiveEditorSection} className="w-full">
                      <TabsList className="grid grid-cols-5 w-full rounded-none bg-muted/50">
                        <TabsTrigger value="personal" className="h-12 text-xs sm:text-sm font-medium">Personal</TabsTrigger>
                        <TabsTrigger value="experience" className="h-12 text-xs sm:text-sm font-medium">Experience</TabsTrigger>
                        <TabsTrigger value="education" className="h-12 text-xs sm:text-sm font-medium">Education</TabsTrigger>
                        <TabsTrigger value="skills" className="h-12 text-xs sm:text-sm font-medium">Skills</TabsTrigger>
                        <TabsTrigger value="awards" className="h-12 text-xs sm:text-sm font-medium">Awards</TabsTrigger>
                      </TabsList>

                      <div className="p-4 [&_input]:font-normal [&_textarea]:font-normal">
                        <TabsContent value="personal" className="mt-0">
                          <PersonalInfoForm
                            fullName={resumeData.personalInfo.fullName}
                            title={resumeData.personalInfo.title}
                            email={resumeData.personalInfo.email}
                            phone={resumeData.personalInfo.phone}
                            location={resumeData.personalInfo.location}
                            website={resumeData.personalInfo.website}
                            summary={resumeData.personalInfo.summary}
                            updateField={updatePersonalInfo}
                          />
                        </TabsContent>

                        <TabsContent value="experience" className="mt-0">
                          <EditorToolbar onAddItem={addItem} activeSection={activeEditorSection} />
                          <div className="mt-4">
                            <ExperienceForm
                              experiences={resumeData.experience}
                              updateExperience={updateExperience}
                              removeItem={(index) => removeItem('experience', index)}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="education" className="mt-0">
                          <EditorToolbar onAddItem={addItem} activeSection={activeEditorSection} />
                          <div className="mt-4">
                            <EducationForm
                              educations={resumeData.education}
                              updateEducation={updateEducation}
                              removeItem={(index) => removeItem('education', index)}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="mt-0">
                          <EditorToolbar onAddItem={addItem} activeSection={activeEditorSection} />
                          <div className="mt-4">
                            <SkillsForm
                              skills={resumeData.skills}
                              languages={resumeData.languages}
                              expertise={resumeData.expertise || []}
                              updateSkill={updateSkill}
                              updateLanguage={updateLanguage}
                              updateExpertise={updateExpertise}
                              removeSkill={(index) => removeItem('skills', index)}
                              removeLanguage={(index) => removeItem('languages', index)}
                              removeExpertise={(index) => removeItem('expertise', index)}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="awards" className="mt-0">
                          <EditorToolbar onAddItem={addItem} activeSection={activeEditorSection} />
                          <div className="mt-4">
                            <AwardsForm
                              awards={resumeData.awards || []}
                              certifications={resumeData.certifications || []}
                              achievements={resumeData.achievements || []}
                              updateAward={updateAward}
                              updateCertification={updateCertification}
                              updateAchievement={updateAchievement}
                              removeAward={(index) => removeItem('awards', index)}
                              removeCertification={(index) => removeItem('certifications', index)}
                              removeAchievement={(index) => removeItem('achievements', index)}
                            />
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </Card>

                  <SectionManager sections={resumeData.sections || {}} onToggle={toggleSection} />
                </div>
              </div>

              {/* Preview section */}
              <div className="lg:col-span-8 xl:col-span-8 order-1 lg:order-2">
                <div className="sticky top-20 space-y-4">
                  <Card className="p-3 shadow-sm border flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Zoom:</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditorZoom(Math.max(50, editorZoom - 10))}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-10 text-center">{editorZoom}%</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditorZoom(Math.min(150, editorZoom + 10))}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                  
                  <div className="bg-gray-100 rounded-lg p-6 flex justify-center overflow-auto" ref={resumeRef}>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      <ResumePreview
                        resumeData={resumeData}
                        currentTemplate={currentTemplate}
                        photoUrl={photoUrl}
                        editorZoom={editorZoom}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Troubleshooting button if all else fails */}
        {!isLoading && (
          <div className="fixed bottom-4 right-4">
            <Button 
              variant="outline" 
              className="bg-white shadow-md"
              onClick={() => {
                console.log("Manual resume reset triggered");
                setResumeData(dummyResumeData);
                toast({
                  title: "Resume reset",
                  description: "Editor has been reset with default data. You can edit and save as a new resume.",
                });
              }}
            >
              Reset Editor
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeEditor;
