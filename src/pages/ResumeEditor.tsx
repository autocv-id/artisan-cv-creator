
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import template components
import ProfessionalTemplate from '@/components/resume/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';

// Initial resume data structure
const initialResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    website: '',
  },
  experience: [
    { id: 1, company: '', position: '', startDate: '', endDate: '', description: '' }
  ],
  education: [
    { id: 1, school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }
  ],
  skills: [''],
  languages: [''],
  certifications: [''],
  awards: [''],
};

// Type definition for the resume data structure
type ResumeDataType = typeof initialResumeData;

// Type for the resume content from Supabase
interface ResumeContent {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    title?: string;
    summary?: string;
    website?: string;
  };
  experience?: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    id: number;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
  awards?: string[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  is_premium: boolean;
  thumbnail: string;
}

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState<ResumeDataType>(initialResumeData);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [currentTemplate, setCurrentTemplate] = useState('professional');
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [userSubscription, setUserSubscription] = useState('free');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'professional';

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
          setTemplateData(templateData);
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
              setCurrentTemplate('professional');
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
              setCurrentTemplate(data.template_id || templateId);
              
              // Type assertion to help TypeScript understand the structure
              const content = data.content as ResumeContent;
              
              // Make sure content is an object before setting it
              if (content && typeof content === 'object' && !Array.isArray(content)) {
                const formattedData: ResumeDataType = {
                  personalInfo: {
                    fullName: content.personalInfo?.fullName || '',
                    email: content.personalInfo?.email || '',
                    phone: content.personalInfo?.phone || '',
                    location: content.personalInfo?.location || '',
                    title: content.personalInfo?.title || '',
                    summary: content.personalInfo?.summary || '',
                    website: content.personalInfo?.website || '',
                  },
                  experience: Array.isArray(content.experience) && content.experience.length > 0 
                    ? content.experience 
                    : initialResumeData.experience,
                  education: Array.isArray(content.education) && content.education.length > 0
                    ? content.education
                    : initialResumeData.education,
                  skills: Array.isArray(content.skills) && content.skills.length > 0
                    ? content.skills
                    : initialResumeData.skills,
                  languages: Array.isArray(content.languages) && content.languages.length > 0
                    ? content.languages
                    : initialResumeData.languages,
                  certifications: Array.isArray(content.certifications) && content.certifications.length > 0
                    ? content.certifications
                    : initialResumeData.certifications || [''],
                  awards: Array.isArray(content.awards) && content.awards.length > 0
                    ? content.awards
                    : initialResumeData.awards || [''],
                };
                
                setResumeData(formattedData);
              }
            }
          } catch (error: any) {
            toast({
              title: "Error fetching resume",
              description: error.message || "Failed to load resume data",
              variant: "destructive",
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading data",
          description: error.message || "Failed to load necessary data",
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

      // TODO: For production, you would upload this to Supabase storage
      // const { data, error } = await supabase.storage
      //   .from('profile-photos')
      //   .upload(`${user?.id}/${Date.now()}_${file.name}`, file);
      
      toast({
        title: "Photo added",
        description: "Your photo has been added to the resume.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    }
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value,
      },
    });
  };

  // Handle experience changes
  const handleExperienceChange = (id: number, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  // Add new experience
  const addExperience = () => {
    const newId = Math.max(0, ...resumeData.experience.map(exp => exp.id)) + 1;
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' }
      ],
    });
  };

  // Remove experience
  const removeExperience = (id: number) => {
    if (resumeData.experience.length > 1) {
      setResumeData({
        ...resumeData,
        experience: resumeData.experience.filter(exp => exp.id !== id),
      });
    } else {
      toast({
        title: "Can't remove all experiences",
        description: "You need at least one experience entry.",
        variant: "destructive",
      });
    }
  };

  // Handle education changes
  const handleEducationChange = (id: number, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  // Add new education
  const addEducation = () => {
    const newId = Math.max(0, ...resumeData.education.map(edu => edu.id)) + 1;
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: newId, school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }
      ],
    });
  };

  // Remove education
  const removeEducation = (id: number) => {
    if (resumeData.education.length > 1) {
      setResumeData({
        ...resumeData,
        education: resumeData.education.filter(edu => edu.id !== id),
      });
    } else {
      toast({
        title: "Can't remove all education",
        description: "You need at least one education entry.",
        variant: "destructive",
      });
    }
  };

  // Handle skills changes
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;
    setResumeData({ ...resumeData, skills: updatedSkills });
  };

  // Add new skill
  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ''],
    });
  };

  // Remove skill
  const removeSkill = (index: number) => {
    if (resumeData.skills.length > 1) {
      const updatedSkills = [...resumeData.skills];
      updatedSkills.splice(index, 1);
      setResumeData({ ...resumeData, skills: updatedSkills });
    } else {
      toast({
        title: "Can't remove all skills",
        description: "You need at least one skill entry.",
        variant: "destructive",
      });
    }
  };

  // Handle languages changes
  const handleLanguageChange = (index: number, value: string) => {
    const updatedLanguages = [...resumeData.languages];
    updatedLanguages[index] = value;
    setResumeData({ ...resumeData, languages: updatedLanguages });
  };

  // Add new language
  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, ''],
    });
  };

  // Remove language
  const removeLanguage = (index: number) => {
    if (resumeData.languages.length > 1) {
      const updatedLanguages = [...resumeData.languages];
      updatedLanguages.splice(index, 1);
      setResumeData({ ...resumeData, languages: updatedLanguages });
    } else {
      toast({
        title: "Can't remove all languages",
        description: "You need at least one language entry.",
        variant: "destructive",
      });
    }
  };

  // Handle certifications changes
  const handleCertificationChange = (index: number, value: string) => {
    const updatedCertifications = [...(resumeData.certifications || [''])];
    updatedCertifications[index] = value;
    setResumeData({ ...resumeData, certifications: updatedCertifications });
  };

  // Add new certification
  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [...(resumeData.certifications || ['']), ''],
    });
  };

  // Remove certification
  const removeCertification = (index: number) => {
    if ((resumeData.certifications || []).length > 1) {
      const updatedCertifications = [...(resumeData.certifications || [''])];
      updatedCertifications.splice(index, 1);
      setResumeData({ ...resumeData, certifications: updatedCertifications });
    } else {
      toast({
        title: "Can't remove all certifications",
        description: "You need at least one certification entry.",
        variant: "destructive",
      });
    }
  };

  // Handle awards changes
  const handleAwardChange = (index: number, value: string) => {
    const updatedAwards = [...(resumeData.awards || [''])];
    updatedAwards[index] = value;
    setResumeData({ ...resumeData, awards: updatedAwards });
  };

  // Add new award
  const addAward = () => {
    setResumeData({
      ...resumeData,
      awards: [...(resumeData.awards || ['']), ''],
    });
  };

  // Remove award
  const removeAward = (index: number) => {
    if ((resumeData.awards || []).length > 1) {
      const updatedAwards = [...(resumeData.awards || [''])];
      updatedAwards.splice(index, 1);
      setResumeData({ ...resumeData, awards: updatedAwards });
    } else {
      toast({
        title: "Can't remove all awards",
        description: "You need at least one award entry.",
        variant: "destructive",
      });
    }
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
    } catch (error: any) {
      toast({
        title: "Error saving resume",
        description: error.message || "Failed to save resume",
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
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        throw new Error("Preview element not found");
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF of A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeTitle || 'resume'}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error: any) {
      toast({
        title: "Error downloading PDF",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Navigate to next tab
  const nextTab = () => {
    const tabs = ['personalInfo', 'experience', 'education', 'skills', 'additional'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Navigate to previous tab
  const prevTab = () => {
    const tabs = ['personalInfo', 'experience', 'education', 'skills', 'additional'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Resume preview component
  const ResumePreview = () => {
    switch (currentTemplate) {
      case 'professional':
        return <ProfessionalTemplate resumeData={resumeData} photoUrl={photoUrl || undefined} />;
      case 'modern':
        return <ModernTemplate resumeData={resumeData} photoUrl={photoUrl || undefined} />;
      default:
        return <ProfessionalTemplate resumeData={resumeData} photoUrl={photoUrl || undefined} />;
    }
  };

  if (isLoading) {
    return (
      <Layout withFooter={false}>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="personalInfo" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="additional" className="data-[state=active]:bg-resume-primary data-[state=active]:text-white">
                  Additional
                </TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personalInfo" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          className="hidden"
                          accept="image/*"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute bottom-0 right-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={resumeData.personalInfo.fullName} 
                          onChange={handlePersonalInfoChange} 
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          value={resumeData.personalInfo.title} 
                          onChange={handlePersonalInfoChange} 
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={resumeData.personalInfo.email} 
                          onChange={handlePersonalInfoChange} 
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={resumeData.personalInfo.phone} 
                          onChange={handlePersonalInfoChange}
                          placeholder="+1 (123) 456-7890" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          name="location" 
                          value={resumeData.personalInfo.location} 
                          onChange={handlePersonalInfoChange}
                          placeholder="New York, NY" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          name="website" 
                          value={resumeData.personalInfo.website || ''} 
                          onChange={handlePersonalInfoChange}
                          placeholder="www.example.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea 
                        id="summary" 
                        name="summary" 
                        value={resumeData.personalInfo.summary} 
                        onChange={handlePersonalInfoChange}
                        placeholder="Brief overview of your qualifications and career goals"
                        rows={4} 
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end mt-4">
                  <Button onClick={nextTab} className="bg-resume-primary hover:bg-resume-primary/90 flex gap-2 items-center">
                    Next 
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Work Experience</h3>
                          {resumeData.experience.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 flex gap-1 items-center"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company-${exp.id}`}>Company</Label>
                              <Input 
                                id={`company-${exp.id}`}
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                placeholder="Company Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`position-${exp.id}`}>Position</Label>
                              <Input 
                                id={`position-${exp.id}`}
                                value={exp.position}
                                onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                                placeholder="Job Title"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                              <Input 
                                id={`startDate-${exp.id}`}
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                placeholder="Jan 2020"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                              <Input 
                                id={`endDate-${exp.id}`}
                                value={exp.endDate}
                                onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                placeholder="Present"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${exp.id}`}>Description</Label>
                            <Textarea 
                              id={`description-${exp.id}`}
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements. Use new lines for bullet points."
                              rows={4}
                            />
                            <p className="text-xs text-gray-500">
                              Tip: Each line will be displayed as a bullet point in the resume.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 flex gap-2 items-center justify-center"
                      onClick={addExperience}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Experience
                    </Button>
                  </CardContent>
                </Card>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={prevTab} className="flex gap-2 items-center">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextTab} className="bg-resume-primary hover:bg-resume-primary/90 flex gap-2 items-center">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Education</h3>
                          {resumeData.education.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-500 hover:text-red-700 flex gap-1 items-center"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`school-${edu.id}`}>School</Label>
                              <Input 
                                id={`school-${edu.id}`}
                                value={edu.school}
                                onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                                placeholder="University Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                              <Input 
                                id={`degree-${edu.id}`}
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                              <Input 
                                id={`field-${edu.id}`}
                                value={edu.field}
                                onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                                placeholder="Computer Science"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`eduStartDate-${edu.id}`}>Start Date</Label>
                              <Input 
                                id={`eduStartDate-${edu.id}`}
                                value={edu.startDate}
                                onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                                placeholder="Sep 2016"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`eduEndDate-${edu.id}`}>End Date</Label>
                              <Input 
                                id={`eduEndDate-${edu.id}`}
                                value={edu.endDate}
                                onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                                placeholder="Jun 2020"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`eduDescription-${edu.id}`}>Additional Information</Label>
                            <Textarea 
                              id={`eduDescription-${edu.id}`}
                              value={edu.description}
                              onChange={(e) => handleEducationChange(edu.id, 'description', e.target.value)}
                              placeholder="Honors, GPA, relevant coursework, etc."
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 flex gap-2 items-center justify-center"
                      onClick={addEducation}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Education
                    </Button>
                  </CardContent>
                </Card>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={prevTab} className="flex gap-2 items-center">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextTab} className="bg-resume-primary hover:bg-resume-primary/90 flex gap-2 items-center">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Skills</h3>
                      {resumeData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input 
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            placeholder="Add a skill (e.g., JavaScript, Project Management)"
                          />
                          {resumeData.skills.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeSkill(index)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="mt-2 flex gap-2 items-center"
                        onClick={addSkill}
                      >
                        <Plus className="h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Languages</h3>
                      {resumeData.languages.map((language, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input 
                            value={language}
                            onChange={(e) => handleLanguageChange(index, e.target.value)}
                            placeholder="Add a language (e.g., English, Spanish)"
                          />
                          {resumeData.languages.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeLanguage(index)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="mt-2 flex gap-2 items-center"
                        onClick={addLanguage}
                      >
                        <Plus className="h-4 w-4" />
                        Add Language
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={prevTab} className="flex gap-2 items-center">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextTab} className="bg-resume-primary hover:bg-resume-primary/90 flex gap-2 items-center">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Additional Tab */}
              <TabsContent value="additional" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                      {(resumeData.certifications || ['']).map((certification, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input 
                            value={certification}
                            onChange={(e) => handleCertificationChange(index, e.target.value)}
                            placeholder="Add a certification (e.g., AWS Certified, PMP)"
                          />
                          {(resumeData.certifications || []).length > 1 && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeCertification(index)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="mt-2 flex gap-2 items-center"
                        onClick={addCertification}
                      >
                        <Plus className="h-4 w-4" />
                        Add Certification
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Awards & Activities</h3>
                      {(resumeData.awards || ['']).map((award, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input 
                            value={award}
                            onChange={(e) => handleAwardChange(index, e.target.value)}
                            placeholder="Add an award or activity"
                          />
                          {(resumeData.awards || []).length > 1 && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeAward(index)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="mt-2 flex gap-2 items-center"
                        onClick={addAward}
                      >
                        <Plus className="h-4 w-4" />
                        Add Award/Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-start mt-4">
                  <Button variant="outline" onClick={prevTab} className="flex gap-2 items-center">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Resume Preview */}
          <div className="hidden lg:block sticky top-24 h-[calc(100vh-140px)] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div id="resume-preview" className="border rounded-lg overflow-hidden shadow-lg">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeEditor;
