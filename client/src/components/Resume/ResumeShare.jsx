import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Linkedin, Mail, Link as LinkIcon, Loader2, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';



const ResumeShare = ({ resumeData, selectedTemplate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const generateShareableLink = () => {
    const data = {
      resume: resumeData,
      template: selectedTemplate
    };
    const encodedData = btoa(JSON.stringify(data));
    return `${window.location.origin}/shared-resume/${encodedData}`;
  };

  const handleShare = async (platform) => {
    try {
      setIsLoading(true);
      const link = generateShareableLink();
      const resumeText = `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}'s Resume\n\n`;
      const shareText = `Check out my resume!`;

      let shareUrl = '';
      let shareData = {};

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}&summary=${encodeURIComponent(shareText)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${resumeText}\n\nView full resume: ${link}`)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(resumeText)}&body=${encodeURIComponent(`${shareText}\n\nView full resume: ${link}`)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(link);
          toast({
            title: "Link copied!",
            description: "Resume link has been copied to clipboard",
          });
          setIsLoading(false);
          return;
        default:
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }

      toast({
        title: "Resume shared!",
        description: `Your resume has been shared via ${platform}`,
      });
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share failed",
        description: "Failed to share resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('facebook')}>
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('linkedin')}>
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleShare('email')}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('copy')}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ResumeShare; 