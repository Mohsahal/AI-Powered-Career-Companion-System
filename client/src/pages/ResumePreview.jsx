import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Share2, Download } from 'lucide-react';
import SimpleTemplate from '@/components/Resume/templates/SimpleTemplate';
import MinimalTemplate from '@/components/Resume/templates/MinimalTemplate';
import ProfessionalTemplate from '@/components/Resume/templates/ProfessionalTemplate';
import ExecutiveTemplate from '@/components/Resume/templates/ExecutiveTemplate';
import html2pdf from 'html2pdf.js';
import { API_ENDPOINTS } from '@/config/api';
const ResumePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const resumeRef = useRef(null);
    useEffect(() => {
        fetchResume();
    }, [id]);
    const fetchResume = async () => {
        try {
            const token = getToken();
            if (!token) {
                toast({
                    title: "Authentication Error",
                    description: "Please log in to view the resume",
                    variant: "destructive"
                });
                return;
            }
            const response = await fetch(API_ENDPOINTS.RESUME_BY_ID(id), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch resume');
            }
            const data = await response.json();
            setResumeData(data);
        }
        catch (error) {
            console.error('Fetch error:', error);
            toast({
                title: "Error",
                description: "Failed to load resume. Please try again.",
                variant: "destructive"
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderTemplate = () => {
        if (!resumeData)
            return null;
        switch (resumeData.template) {
            case 'simple':
                return <SimpleTemplate data={resumeData}/>;
            case 'minimal':
                return <MinimalTemplate data={resumeData}/>;
            case 'professional':
                return <ProfessionalTemplate data={resumeData}/>;
            case 'executive':
                return <ExecutiveTemplate data={resumeData}/>;
            default:
                return <SimpleTemplate data={resumeData}/>;
        }
    };
    const handleSharePDF = async () => {
        if (!resumeRef.current)
            return;
        setIsGeneratingPDF(true);
        try {
            const element = resumeRef.current;
            const opt = {
                margin: 10,
                filename: `${resumeData?.personalInfo.firstName}_${resumeData?.personalInfo.lastName}_Resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
            toast({
                title: "Success",
                description: "Resume PDF has been generated successfully",
            });
        }
        catch (error) {
            console.error('PDF generation error:', error);
            toast({
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
                variant: "destructive"
            });
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    const handleShare = async () => {
        if (!resumeData || !id) {
            toast({
                title: "Error",
                description: "Resume data or ID is missing",
                variant: "destructive"
            });
            return;
        }
        try {
            const token = getToken();
            if (!token) {
                toast({
                    title: "Authentication Error",
                    description: "Please log in to share the resume",
                    variant: "destructive"
                });
                return;
            }
            // Create a shareable link with the resume ID
            const shareableUrl = `${window.location.origin}/shared-resume/${id}`;
            // Create share data
            const shareData = {
                title: `${resumeData.personalInfo.firstName}'s Resume`,
                text: `Check out ${resumeData.personalInfo.firstName}'s professional resume`,
                url: shareableUrl
            };
            // Try to use the Web Share API first
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    toast({
                        title: "Success",
                        description: "Resume shared successfully",
                    });
                }
                catch (shareError) {
                    console.error('Share API error:', shareError);
                    // Fallback to clipboard
                    await navigator.clipboard.writeText(shareableUrl);
                    toast({
                        title: "Link Copied",
                        description: "Resume link has been copied to clipboard",
                    });
                }
            }
            else {
                // For browsers that don't support Web Share API
                await navigator.clipboard.writeText(shareableUrl);
                toast({
                    title: "Link Copied",
                    description: "Resume link has been copied to clipboard",
                });
            }
        }
        catch (error) {
            console.error('Share error:', error);
            toast({
                title: "Error",
                description: "Failed to share resume. Please try again.",
                variant: "destructive"
            });
        }
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!resumeData) {
        return (<div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Resume Not Found</h2>
          <Button onClick={() => navigate('/my-resumes')}>
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to My Resumes
          </Button>
        </div>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-8 mt-10 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate('/my-resumes')} className="self-start sm:self-center">
          <ArrowLeft className="h-4 w-4 mr-2"/>
          Back to My Resumes
        </Button>
        <div className="flex items-center space-x-4 self-end sm:self-center">
          <Button variant="outline" onClick={handleShare} className="hover:bg-gray-100">
            <Share2 className="h-4 w-4 mr-2"/>
            Share Link
          </Button>
          <Button onClick={handleSharePDF} disabled={isGeneratingPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isGeneratingPDF ? (<Loader2 className="h-4 w-4 mr-2 animate-spin"/>) : (<Download className="h-4 w-4 mr-2"/>)}
            Download PDF
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-lg rounded-lg p-6" ref={resumeRef}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>);
};
export default ResumePreview;
