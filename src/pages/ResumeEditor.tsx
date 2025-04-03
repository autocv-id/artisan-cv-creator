
import { useState } from 'react';
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
import { Link } from 'react-router-dom';

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

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [currentTemplate, setCurrentTemplate] = useState('professional');
  const { toast } = useToast();

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
  const handleSave = () => {
    // This would typically save to a database
    toast({
      title: "Resume saved!",
      description: "Your resume has been saved successfully.",
    });
  };

  // Handle download PDF
  const handleDownload = () => {
    // This would generate and download a PDF
    toast({
      title: "Downloading PDF",
      description: "Your resume is being generated and downloaded.",
    });
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

  // Mock resume preview component
  const ResumePreview = () => {
    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="bg-resume-primary text-white p-6">
          <h2 className="text-2xl font-bold">{resumeData.personalInfo.fullName || 'Your Name'}</h2>
          <p>{resumeData.personalInfo.title || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <span>{resumeData.personalInfo.email}</span>
            <span>{resumeData.personalInfo.phone}</span>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        </div>
        <div className="p-6">
          {resumeData.personalInfo.summary && (
            <div className="mb-5">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Summary</h3>
              <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
            </div>
          )}
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Experience</h3>
            {resumeData.experience.map((exp) => (
              exp.company && (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-resume-primary">{exp.company}</p>
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                </div>
              )
            ))}
          </div>
          
          <div className="mb-5">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h3>
            {resumeData.education.map((edu) => (
              edu.school && (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{edu.school}</h4>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-resume-primary">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                </div>
              )
            ))}
          </div>
          
          {resumeData.skills.some(skill => skill) && (
            <div className="mb-5">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  skill && (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}
          
          {resumeData.languages.some(language => language) && (
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.languages.map((language, index) => (
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

  return (
    <Layout withFooter={false}>
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-resume-primary">Resume Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} className="flex gap-2 items-center">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Link to="/preview">
              <Button variant="outline" className="flex gap-2 items-center">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button onClick={handleDownload} className="bg-resume-primary hover:bg-resume-primary/90 flex gap-2 items-center">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
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
              </TabsList>

              <TabsContent value="personalInfo" className="animate-fade-in">
                <Card>
                  <CardContent className="pt-6 space-y-4">
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
                              placeholder="Describe your responsibilities and achievements"
                              rows={3}
                            />
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
            <ResumePreview />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeEditor;
