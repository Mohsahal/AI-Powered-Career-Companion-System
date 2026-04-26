import { API_ENDPOINTS } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, Eye, MoreVertical, Plus, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useResume } from '@/contexts/ResumeContext';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
const MyResumes = () => {
    const { getToken, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { resumes, isLoading, fetchResumes, deleteResume: contextDeleteResume } = useResume();
    const [isDeleting, setIsDeleting] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);
    // Fetch resumes when component mounts or when authentication state changes
    // Wait for auth to finish loading before fetching
    useEffect(() => {
        // Don't do anything while auth is still loading
        // This prevents clearing resumes during page refresh
        if (authLoading) {
            console.log('[MyResumes] Auth still loading, waiting...');
            return;
        }
        // Only fetch if authenticated
        if (isAuthenticated) {
            console.log('[MyResumes] Auth ready, fetching resumes...');
            fetchResumes();
        }
        else {
            console.log('[MyResumes] Not authenticated');
        }
    }, [isAuthenticated, authLoading, fetchResumes]);
    const handleDeleteClick = (id) => {
        setResumeToDelete(id);
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (!resumeToDelete)
            return;
        try {
            setIsDeleting(resumeToDelete);
            const token = getToken();
            if (!token) {
                toast({
                    title: "Authentication Error",
                    description: "Please log in to delete resumes",
                    variant: "destructive"
                });
                return;
            }
            const response = await fetch(API_ENDPOINTS.RESUME_BY_ID(resumeToDelete), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                contextDeleteResume(resumeToDelete);
                toast({
                    title: "Success",
                    description: "Resume deleted successfully",
                });
            }
            else {
                throw new Error('Failed to delete resume');
            }
        }
        catch (error) {
            console.error('Delete error:', error);
            toast({
                title: "Error",
                description: "Failed to delete resume. Please try again.",
                variant: "destructive"
            });
        }
        finally {
            setIsDeleting(null);
            setDeleteDialogOpen(false);
            setResumeToDelete(null);
        }
    };
    const handleEditResume = (id) => {
        navigate(`/resume-builder/${id}`);
    };
    const handlePreviewResume = (id) => {
        navigate(`/resume-preview/${id}`);
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600"/>
      </div>);
    }
    return (<div className="container mx-auto py-8 px-4 mt-10">
      <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 mb-6">
        <ArrowLeft className="h-4 w-4"/>
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-purple-600 to-brand-500">
            My Resumes
          </h1>
          <p className="text-gray-500 mt-2">Manage and edit your professional resumes</p>
        </div>
        <Button onClick={() => navigate('/resume-builder')} className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white">
          <Plus className="h-4 w-4"/>
          Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (<Card className="border-2 border-dashed border-gray-200 hover:border-brand-200 transition-colors duration-300">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
              <FileText className="h-10 w-10 text-brand-600"/>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Resumes Yet</h3>
            <p className="text-gray-500 mb-6">Create your first resume to get started with your career journey</p>
            <Button onClick={() => navigate('/resume-builder')} className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white">
              Create Resume
            </Button>
          </CardContent>
        </Card>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (<Card key={resume._id} className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-brand-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-brand-600"/>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                        {resume.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4"/>
                        <span>{new Date(resume.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4"/>
                        <span>{new Date(resume.lastModified).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-brand-50">
                        <MoreVertical className="h-4 w-4"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreviewResume(resume._id)}>
                        <Eye className="h-4 w-4 mr-2"/>
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditResume(resume._id)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(resume._id)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2"/>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200" onClick={() => handlePreviewResume(resume._id)}>
                    <Eye className="h-4 w-4 mr-2"/>
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200" onClick={() => handleEditResume(resume._id)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>))}
        </div>)}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={isDeleting === resumeToDelete}>
              {isDeleting === resumeToDelete ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Deleting...
                </>) : ('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
};
export default MyResumes;
