import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

const ResumeDownload = ({ resumeData, selectedTemplate }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Get the resume preview element
      const element = document.querySelector('.resume-preview');
      if (!element) {
        throw new Error('Resume preview not found');
      }

      // Configure PDF options
      const opt = {
        margin: 10,
        filename: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "Download successful",
        description: "Your resume has been downloaded as PDF",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2"
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </>
      )}
    </Button>
  );
};

export default ResumeDownload; 