import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { generateSummaryWithAI, generateExperienceDescription, generateProjectDescription } from '@/service/AIModel';
import { useAuth } from '@/contexts/AuthContext';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().optional(),
});

const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isCurrentPosition: z.boolean().optional(),
  description: z.string().min(1, "Description is required"),
});

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  link: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

const resumeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
});

const ResumeForm = ({ initialData, onUpdate }) => {
  const { getToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal');
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [generatingExperience, setGeneratingExperience] = useState(null);
  const [generatingProject, setGeneratingProject] = useState(null);
  
  const form = useForm({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = 
    useFieldArray({
      control: form.control,
      name: "skills"
    });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = 
    useFieldArray({ control: form.control, name: "experience" });
    
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = 
    useFieldArray({ control: form.control, name: "education" });
  
  const { fields: projectFields, append: appendProject, remove: removeProject } = 
    useFieldArray({ control: form.control, name: "projects" });
  
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = 
    useFieldArray({ control: form.control, name: "certifications" });

  // Watch for form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onUpdate(value);
      setHasChanges(true);
      // Clear validation errors when form changes
      setValidationErrors([]);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, onUpdate]);

  const validateForm = useCallback(() => {
    const errors = [];
    const values = form.getValues();

    // Validate required fields
    if (!values.personalInfo?.firstName) errors.push('First name is required');
    if (!values.personalInfo?.lastName) errors.push('Last name is required');
    if (!values.personalInfo?.jobTitle) errors.push('Job title is required');
    if (!values.personalInfo?.email) errors.push('Email is required');
    if (!values.personalInfo?.phone) errors.push('Phone number is required');

    // Validate at least one experience entry
    if (!values.experience?.length) {
      errors.push('At least one work experience is required');
    }

    // Validate at least one education entry
    if (!values.education?.length) {
      errors.push('At least one education entry is required');
    }

    // Validate at least one skill
    if (!values.skills?.length) {
      errors.push('At least one skill is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [form]);

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: "No changes to save",
        description: "Make some changes to your resume before saving",
      });
      return;
    }

    // Validate form before saving
    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: (
          <div className="mt-2">
            <p className="font-medium">Please fix the following issues:</p>
            <ul className="list-disc list-inside mt-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const formData = form.getValues();
      await onUpdate(formData);
      setSaveSuccess(true);
      setHasChanges(false);
      setValidationErrors([]);
      
      toast({
        title: "Resume saved successfully",
        description: "Your changes have been saved",
        className: "bg-green-50 border-green-200",
      });

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save resume. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const token = getToken();
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to use AI features",
          variant: "destructive"
        });
        return;
      }

      const jobTitle = form.getValues('personalInfo.jobTitle');
      if (!jobTitle) {
        toast({
          title: "Job title required",
          description: "Please enter your job title first to generate a summary",
          variant: "destructive"
        });
        return;
      }

      const summary = await generateSummaryWithAI(jobTitle, token);
      form.setValue('summary', summary);
      toast({
        title: "Summary Generated",
        description: "AI has generated a professional summary for your resume",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate summary. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateExperienceDescription = async (index) => {
    try {
      setGeneratingExperience(index);
      const token = getToken();
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to use AI features",
          variant: "destructive"
        });
        return;
      }

      const { position, company } = form.getValues(`experience.${index}`);
      if (!position || !company) {
        toast({
          title: "Missing Information",
          description: "Please enter both position and company name to generate a description",
          variant: "destructive"
        });
        return;
      }

      const description = await generateExperienceDescription(position, company, "Technology", token);
      
      const updatedExperience = [...form.getValues('experience')];
      updatedExperience[index] = {
        ...updatedExperience[index],
        description
      };

      form.setValue('experience', updatedExperience);

      toast({
        title: "Description Generated",
        description: "AI has generated a professional description for your experience",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error generating experience description:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate description. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGeneratingExperience(null);
    }
  };

  const handleGenerateProjectDescription = async (index) => {
    try {
      setGeneratingProject(index);
      const token = getToken();
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to use AI features",
          variant: "destructive"
        });
        return;
      }

      const { name, technologies } = form.getValues(`projects.${index}`);
      if (!name) {
        toast({
          title: "Missing Information",
          description: "Please enter the project name to generate a description",
          variant: "destructive"
        });
        return;
      }

      const description = await generateProjectDescription(
        name,
        technologies || [],
        "Developer",
        token
      );
      
      const updatedProjects = [...form.getValues('projects')];
      updatedProjects[index] = {
        ...updatedProjects[index],
        description
      };

      form.setValue('projects', updatedProjects);

      toast({
        title: "Description Generated",
        description: "AI has generated a professional description for your project",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error generating project description:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate description. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGeneratingProject(null);
    }
  };

  const handleNextTab = () => {
    const tabs = ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    const tabs = ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resume Information</h2>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevTab}
              disabled={currentTab === 'personal'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleNextTab}
              disabled={currentTab === 'certifications'}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="animate-fade-in">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="personalInfo.jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel>Professional Summary</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateSummary}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          isGenerating 
                            ? 'bg-gray-100 dark:bg-gray-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating Summary...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate with AI</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Brief overview of your skills and career goals"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="animate-fade-in">
            <div className="space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Experience #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Developer Intern" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input placeholder="Jun 2022" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input placeholder="Aug 2022" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center mb-2">
                            <FormLabel>Description</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateExperienceDescription(index)}
                              disabled={generatingExperience === index}
                              className={`flex items-center gap-2 transition-all duration-200 ${
                                generatingExperience === index 
                                  ? 'bg-gray-100 dark:bg-gray-800' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {generatingExperience === index ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Generating Description...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  <span>Generate with AI</span>
                                </>
                              )}
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendExperience({ 
                  position: "",
                  company: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  description: ""
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="animate-fade-in">
            <div className="space-y-4">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Education #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree/Certificate</FormLabel>
                          <FormControl>
                            <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="University Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="2018 - 2022" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Relevant coursework, achievements, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendEducation({ 
                  degree: "", 
                  institution: "", 
                  date: "", 
                  description: "" 
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="animate-fade-in">
            <div className="space-y-4">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`skills.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Skill e.g. JavaScript" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendSkill("")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="animate-fade-in">
            <div className="space-y-4">
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Project #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E-commerce Website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies Used</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="React, Node.js, MongoDB (comma separated)" 
                              {...field}
                              onChange={(e) => {
                                const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
                                field.onChange(technologies);
                              }}
                              value={field.value?.join(', ') || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan 2022 - Mar 2022" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center mb-2">
                            <FormLabel>Description</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateProjectDescription(index)}
                              disabled={generatingProject === index}
                              className={`flex items-center gap-2 transition-all duration-200 ${
                                generatingProject === index 
                                  ? 'bg-gray-100 dark:bg-gray-800' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {generatingProject === index ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Generating Description...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  <span>Generate with AI</span>
                                </>
                              )}
                            </Button>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the project"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/yourusername/project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendProject({ 
                  name: "", 
                  description: "", 
                  date: "", 
                  link: "",
                  technologies: []
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="animate-fade-in">
            <div className="space-y-4">
              {certificationFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Certification #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certification Name</FormLabel>
                          <FormControl>
                            <Input placeholder="AWS Certified Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issuing Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Amazon Web Services" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="Apr 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Additional details about certification" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendCertification({ 
                  name: "", 
                  issuer: "", 
                  date: "", 
                  description: "" 
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end items-center gap-4">
          {validationErrors.length > 0 && (
            <div className="flex items-center gap-2 text-destructive animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{validationErrors.length} validation errors</span>
            </div>
          )}
          {hasChanges && !isSaving && !saveSuccess && (
            <span className="text-sm text-muted-foreground animate-fade-in">
              You have unsaved changes
            </span>
          )}
          <Button 
            type="submit" 
            variant="outline"
            className="flex items-center gap-2"
            disabled={isSaving || (!hasChanges && !saveSuccess)}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResumeForm;