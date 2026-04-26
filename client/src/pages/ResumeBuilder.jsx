import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeBuilderLayout from '@/components/layout/ResumeBuilderLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import SimpleTemplate from '@/components/Resume/templates/SimpleTemplate';
import MinimalTemplate from '@/components/Resume/templates/MinimalTemplate';
import ProfessionalTemplate from '@/components/Resume/templates/ProfessionalTemplate';
import ExecutiveTemplate from '@/components/Resume/templates/ExecutiveTemplate';
import TemplateSelector from '@/components/Resume/TemplateSelector';
import ResumeForm from '@/components/Resume/ResumeForm';
import ResumeDownload from '@/components/Resume/ResumeDownload';
import { 
  Save, 
  Facebook, 
  Linkedin, 
  Mail,
  Link,
  MessageCircle,
  Twitter,
  Github,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useResume } from '@/contexts/ResumeContext';
import { defaultResumeData } from '@/data/defaultResumeData';
import { API_ENDPOINTS } from '@/config/api';

const templateThumbnails = {
  simple: 'https://placehold.co/200x250/e2e8f0/1e293b?text=Simple',
  minimal: 'https://placehold.co/200x250/e2e8f0/1e293b?text=Minimal',
  professional: 'https://placehold.co/200x250/e2e8f0/1e293b?text=Professional',
  executive: 'https://placehold.co/200x250/e2e8f0/1e293b?text=Executive'
};

const templates = [
  {
    id: "simple",
    name: "Simple Classic",
    description: "Traditional resume layout with clear sections",
    thumbnail: templateThumbnails.simple,
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Minimalist design focusing on content clarity",
    thumbnail: templateThumbnails.minimal,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Polished design with emphasis on experience and skills",
    thumbnail: templateThumbnails.professional,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior professionals",
    thumbnail: templateThumbnails.executive,
  },
];

const ResumeBuilder = () => {
  const { getToken } = useAuth();
  const { addResume, updateResume } = useResume();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("simple");
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume(id);
    } else {
      // If no ID, reset to default data for new resume
      setResumeData(defaultResumeData);
      setSelectedTemplate('simple');
      setActiveTab('build');
    }
  }, [id]);

  const fetchResume = async (resumeId) => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to edit the resume",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(API_ENDPOINTS.RESUME_BY_ID(resumeId), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      const data = await response.json();
      
      // Ensure data structure is complete when loading existing resume
      const completeResumeData = {
        personalInfo: {
          firstName: data.personalInfo?.firstName || '',
          lastName: data.personalInfo?.lastName || '',
          jobTitle: data.personalInfo?.jobTitle || '',
          email: data.personalInfo?.email || '',
          phone: data.personalInfo?.phone || '',
          location: data.personalInfo?.location || '',
        },
        summary: data.summary || '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
      };
      
      setResumeData(completeResumeData);
      setSelectedTemplate(data.template || 'simple');
      setActiveTab('build');
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save your resume",
          variant: "destructive"
        });
        return;
      }

      const resumeToSave = {
        ...resumeData,
        template: selectedTemplate,
        title: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}'s Resume`,
        lastModified: new Date().toISOString()
      };

      const response = await fetch(id ? API_ENDPOINTS.RESUME_BY_ID(id) : API_ENDPOINTS.RESUMES, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resumeToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      const data = await response.json();
      
      // Update the ResumeContext with the new/updated resume
      const resumeForContext = {
        _id: data._id || id,
        title: resumeToSave.title,
        template: selectedTemplate,
        lastModified: resumeToSave.lastModified,
        personalInfo: resumeData.personalInfo
      };
      
      if (id) {
        updateResume(id, resumeForContext);
      } else {
        addResume(resumeForContext);
      }
      
      toast({
        title: "Success",
        description: id ? "Resume updated successfully" : "Resume saved successfully",
      });

      // Redirect to My Resumes page after saving
      navigate('/my-resumes');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateResume = useCallback((data) => {
    setResumeData(data);
    
    // If we have an ID, update the resume in context
    if (id) {
      const updatedResumeForContext = {
        _id: id,
        title: `${data.personalInfo.firstName} ${data.personalInfo.lastName}'s Resume`,
        template: selectedTemplate,
        lastModified: new Date().toISOString(),
        personalInfo: data.personalInfo
      };
      updateResume(id, updatedResumeForContext);
    }
  }, [id, selectedTemplate, updateResume]);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template updated",
      description: "Your resume template has been changed",
    });
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'simple':
        return <SimpleTemplate data={resumeData} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} />;
      case 'professional':
        return <ProfessionalTemplate data={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate data={resumeData} />;
      default:
        return <SimpleTemplate data={resumeData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ResumeBuilderLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 mt-14">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-purple-600 to-brand-500">
              {id ? 'Edit Resume' : 'Resume Builder'}
            </h1>
            <p className="text-gray-500 mt-2">Create a professional resume that stands out</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={handleSaveResume} 
              disabled={isSaving}
              variant="outline"
              className="flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {id ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {id ? 'Update Resume' : 'Save Resume'}
                </>
              )}
            </Button>
            <ResumeDownload resumeData={resumeData} selectedTemplate={selectedTemplate} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-transparent border-b border-gray-200">
            <TabsTrigger 
              value="build" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-brand-500 rounded-none data-[state=active]:shadow-none"
            >
              Build Resume
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:border-b-2 data-[state=active]:border-brand-500 rounded-none data-[state=active]:shadow-none"
            >
              Choose Template
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="build" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="order-2 lg:order-1">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-gray-100">
                  <CardContent className="p-4 md:p-6">
                    <ResumeForm 
                      initialData={resumeData}
                      onUpdate={handleUpdateResume}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="order-1 lg:order-2">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-gray-100 sticky top-4">
                  <CardContent className="p-4 md:p-6">
                    <div className="resume-preview" key={`${selectedTemplate}-${resumeData.personalInfo?.firstName || 'new'}`}>
                      {renderTemplate()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="animate-fade-in">
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateChange}
            />
          </TabsContent>
        </Tabs>
      </div>

    </ResumeBuilderLayout>
  );
};

export default ResumeBuilder;
