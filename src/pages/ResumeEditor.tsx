import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Eye 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Initial resume data structure
const initialResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  },
  experience: [
    { id: 1, company: '', position: '', startDate: '', endDate: '', description: '' }
  ],
  education: [
    { id: 1, school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }
  ],
  skills: [''],
  languages: [''],
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
}

// Template interface matching database structure
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
  const [currentTemplate, setCurrentTemplate] = useState<string>('professional');
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Fetch template info
  useEffect(() => {
    const fetchTemplateData = async (templateId: string) => {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (error) throw error;
        if (data) {
          setTemplateData(data);
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    // Get template from URL params or state
    const templateFromUrl = searchParams.get('template');
    if (templateFromUrl) {
      setCurrentTemplate(templateFromUrl);
      fetchTemplateData(templateFromUrl);
    } else if (currentTemplate) {
      fetchTemplateData(currentTemplate);
    }
  }, [currentTemplate, searchParams]);

  // Fetch resume data if editing an existing resume
  useEffect(() => {
    const fetchResumeData = async () => {
      if (id && id !== 'new' && user) {
        setIsLoading(true);
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
            setCurrentTemplate(data.template_id || 'professional');
            
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
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchResumeData();
  }, [id, user, toast]);

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
      // Check if the template is premium and user is on free plan
      if (templateData?.is_premium) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // If user is on free plan but trying to use premium template
        if (profileData?.subscription_status === 'free') {
          toast({
            title: "Premium template",
            description: "Please upgrade to use premium templates",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      }

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

  // Handle download PDF with improved quality
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        throw new Error("Preview element not found");
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 4, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0); // Use maximum quality
      
      // Create PDF of A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false, // Disable compression for better quality
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, '', 'FAST');
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
    const tabs = ['personalInfo', 'experience', 'education', 'skills'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Navigate to previous tab
  const prevTab = () => {
    const tabs = ['personalInfo', 'experience', 'education', 'skills'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Resume Preview Components based on template
  const renderResumePreview = () => {
    switch (currentTemplate) {
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'creative':
        return <CreativeTemplate data={resumeData} />;
      case 'minimalist':
        return <MinimalistTemplate data={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate data={resumeData} />;
      case 'corporate': 
        return <CorporateTemplate data={resumeData} />;
      case 'digital':
        return <DigitalTemplate data={resumeData} />;
      case 'professional':
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  // Templates
  const ProfessionalTemplate = ({ data }: { data: ResumeDataType }) => {
    return (
      <div id="resume-preview" className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="bg-[#1A365D] text-white p-6">
          <h2 className="text-2xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h2>
          <p>{data.personalInfo.title || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>
        <div className="p-6">
          {data.personalInfo.summary && (
            <div className="mb-5">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Summary</h3>
              <p className="text-gray-700">{data.personalInfo.summary}</p>
            </div>
          )}
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Experience</h3>
            {data.experience.map((exp) => (
              exp.company && (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-[#1A365D]">{exp.company}</p>
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                </div>
              )
            ))}
          </div>
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h3>
            {data.education.map((edu) => (
              edu.school && (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{edu.school}</h4>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-[#1A365D]">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                </div>
              )
            ))}
          </div>
          
          {data.skills.some(skill => skill) && (
            <div className="mb-5">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  skill && (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}
          
          {data.languages.some(language => language) && (
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((language, index) => (
                  language && (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {language}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ModernTemplate = ({ data }: { data: ResumeDataType }) => {
    return (
      <div id="resume-preview" className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="bg-[#38B2AC] text-white p-6 md:w-1/3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">{data.personalInfo.fullName || 'Your Name'}</h2>
              <p className="text-white/90">{data.personalInfo.title || 'Professional Title'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">Contact</h3>
              <div className="space-y-2 text-sm">
                <p>{data.personalInfo.email}</p>
                <p>{data.personalInfo.phone}</p>
                <p>{data.personalInfo.location}</p>
              </div>
            </div>
            
            {data.skills.some(skill => skill) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, index) => (
                    skill && (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs mb-1">
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {data.languages.some(language => language) && (
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">Languages</h3>
                <div className="flex flex-col gap-1">
                  {data.languages.map((language, index) => (
                    language && (
                      <span key={index} className="text-sm">
                        {language}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 md:w-2/3">
            {data.personalInfo.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Professional Summary</h3>
                <p className="text-gray-700">{data.personalInfo.summary}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Experience</h3>
              {data.experience.map((exp) => (
                exp.company && (
                  <div key={exp.id} className="mb-4">
                    <div className="flex flex-col md:flex-row md:justify-between mb-1">
                      <h4 className="font-semibold text-[#38B2AC]">{exp.position}</h4>
                      <span className="text-gray-600 text-sm">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="font-medium">{exp.company}</p>
                    <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                  </div>
                )
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h3>
              {data.education.map((edu) => (
                edu.school && (
                  <div key={edu.id} className="mb-4">
                    <div className="flex flex-col md:flex-row md:justify-between mb-1">
                      <h4 className="font-semibold">{edu.school}</h4>
                      <span className="text-gray-600 text-sm">
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-[#38B2AC]">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                    <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MinimalistTemplate = ({ data }: { data: ResumeDataType }) => {
    return (
      <div id="resume-preview" className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-1">{data.personalInfo.fullName || 'Your Name'}</h2>
            <p className="text-gray-600">{data.personalInfo.title || 'Professional Title'}</p>
            
            <div className="flex justify-center flex-wrap gap-4 mt-3 text-sm">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
            </div>
          </div>
          
          {data.personalInfo.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-center">Summary</h3>
              <p className="text-gray-700 text-center">{data.personalInfo.summary}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Experience</h3>
            {data.experience.map((exp) => (
              exp.company && (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                </div>
              )
            ))}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Education</h3>
            {data.education.map((edu) => (
              edu.school && (
                <div key={edu.id} className="mb-5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{edu.school}</h4>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                </div>
              )
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.skills.some(skill => skill) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-center">Skills</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {data.skills.map((skill, index) => (
                    skill && (
                      <span key={index} className="border border-gray-300 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {data.languages.some(language => language) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-center">Languages</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {data.languages.map((language, index) => (
                    language && (
                      <span key={index} className="border border-gray-300 px-3 py-1 rounded-full text-sm">
                        {language}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CreativeTemplate = ({ data }: { data: ResumeDataType }) => {
    return (
      <div id="resume-preview" className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="bg-gradient-to-r from-[#4299E1] to-[#63B3ED] text-white p-6">
          <h2 className="text-3xl font-bold tracking-wide">{data.personalInfo.fullName || 'Your Name'}</h2>
          <p className="text-white/90 font-light text-lg">{data.personalInfo.title || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            {data.personalInfo.summary && (
              <div>
                <h3 className="text-xl font-bold text-[#4299E1] mb-3">About Me</h3>
                <p className="text-gray-700 italic">{data.personalInfo.summary}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold text-[#4299E1] mb-3">Experience</h3>
              {data.experience.map((exp) => (
                exp.company && (
                  <div key={exp.id} className="mb-5 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-[#4299E1] before:rounded-full">
                    <h4 className="font-bold text-lg">{exp.position}</h4>
                    <p className="text-[#4299E1] font-medium">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#4299E1] mb-3">Education</h3>
              {data.education.map((edu) => (
                edu.school && (
                  <div key={edu.id} className="mb-5">
                    <h4 className="font-bold">{edu.school}</h4>
                    <p>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                    <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate || 'Present'}</p>
                    <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                  </div>
                )
              ))}
            </div>
            
            {data.skills.some(skill => skill) && (
              <div>
                <h3 className="text-xl font-bold text-[#4299E1] mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    skill && (
                      <span key={index} className="bg-[#EBF8FF] text-[#4299E1] px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {data.languages.some(language => language) && (
              <div>
                <h3 className="text-xl font-bold text-[#4299E1] mb-3">Languages</h3>
                <ul className="list-disc list-inside">
                  {data.languages.map((language, index) => (
                    language && (
                      <li key={index} className="text-gray-700">
                        {language}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CorporateTemplate = ({ data }: { data: ResumeDataType }) => {
    // Implementation of CorporateTemplate
  };

  const DigitalTemplate = ({ data }: { data: ResumeDataType }) => {
    // Implementation of DigitalTemplate
  };

  const ExecutiveTemplate = ({ data }: { data: ResumeDataType }) => {
    // Implementation of ExecutiveTemplate
  };

  return (
    <Layout>
      {/* Rest of the component content */}
    </Layout>
  );
};

export default ResumeEditor;
