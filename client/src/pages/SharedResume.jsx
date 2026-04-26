import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlainLayout from '@/components/layout/PlainLayout';
import SimpleTemplate from '@/components/Resume/templates/SimpleTemplate';
import MinimalTemplate from '@/components/Resume/templates/MinimalTemplate';
import ProfessionalTemplate from '@/components/Resume/templates/ProfessionalTemplate';
import ExecutiveTemplate from '@/components/Resume/templates/ExecutiveTemplate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SharedResume = () => {
  const { encodedData } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('simple');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!encodedData) {
      toast({
        title: "Error",
        description: "Resume data not found in link.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Decode the base64 data
      const decodedString = atob(encodedData);
      console.log("Decoded string:", decodedString); // Log decoded string

      // Parse the JSON data
      const decodedData = JSON.parse(decodedString);
      console.log("Parsed data:", decodedData); // Log parsed data

      // Validate the structure of decoded data
      if (decodedData && decodedData.resume && decodedData.template) {
        setResumeData(decodedData.resume);
        setSelectedTemplate(decodedData.template);
        toast({
          title: "Success",
          description: "Resume data loaded successfully.",
        });
      } else {
        console.error('Error: Decoded data is missing resume or template properties.', decodedData); // Log invalid structure
        toast({
          title: "Error",
          description: "Invalid resume data structure.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error decoding or parsing resume data:', error); // Log specific error
      toast({
        title: "Error",
        description: "Failed to decode or parse resume data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [encodedData]);

  const renderTemplate = () => {
    if (!resumeData) return null;

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

  const handleDownload = () => {
    // Implement download functionality - This would require converting the rendered template to a downloadable format (e.g., PDF)
    // This is a placeholder.
    toast({
      title: "Download function not fully implemented",
      description: "Please note that the download functionality is not yet complete.",
    });
  };

  if (isLoading) {
    return (
      <PlainLayout>
        <div className="container mx-auto mt-14 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </PlainLayout>
    );
  }

  if (!resumeData) {
    return (
      <PlainLayout>
        <div className="container mx-auto mt-14 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Resume Not Found or Invalid Data</h1>
            <p className="text-gray-600 mb-4">Could not load the resume. The link might be incorrect or expired, or the data is invalid.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </PlainLayout>
    );
  }

  return (
    <PlainLayout>
      <div className="container mx-auto mt-14 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}'s Resume
          </h1>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="w-full lg:w-7/12">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="resume-preview">
                  {renderTemplate()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlainLayout>
  );
};

export default SharedResume; 