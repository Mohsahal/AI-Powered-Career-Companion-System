import React, { createContext, useContext, useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
const ResumeContext = createContext(undefined);
export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};
export const ResumeProvider = ({ children }) => {
    const [resumes, setResumes] = useState([]);
    const [recentResume, setRecentResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // Directly use useAuth since ResumeProvider is inside AuthProvider
    const { isAuthenticated, isLoading: authLoading, getToken } = useAuth();
    const fetchResumes = useCallback(async (showToast = false) => {
        // Don't clear resumes if auth is still loading - wait for it to finish
        // This is critical to prevent clearing resumes during page refresh
        if (authLoading) return;
        // Don't clear resumes just because isAuthenticated is false
        // Only clear if API returns 401/403 - this prevents clearing during page refresh
        // If user is not authenticated, just return without fetching
        if (!isAuthenticated) return;
        try {
            setIsLoading(true);
            const token = getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }
            const response = await fetch(API_ENDPOINTS.RESUMES, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setResumes(data);
                // Set the most recent resume
                if (data.length > 0) {
                    const sortedResumes = [...data].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
                    setRecentResume(sortedResumes[0]);
                }
                else {
                    setRecentResume(null);
                }
                // Show success toast for manual refresh
                if (showToast) {
                    toast({
                        title: "Resumes refreshed",
                        description: `Found ${data.length} resume${data.length !== 1 ? 's' : ''}`,
                        className: "bg-green-50 border-green-200",
                    });
                }
            }
            else {
                // If API fails with 401/403, user might not be authenticated
                if (response.status === 401 || response.status === 403) {
                    setResumes([]);
                    setRecentResume(null);
                }
                // For other errors, don't clear - might be a temporary issue
                if (showToast) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch resumes",
                        variant: "destructive"
                    });
                }
            }
        }
        catch (error) {
            console.error('Error fetching resumes:', error);
            // Don't clear resumes on network errors - might be temporary
            if (showToast) {
                toast({
                    title: "Error",
                    description: "Failed to fetch resumes",
                    variant: "destructive"
                });
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authLoading, getToken]);
    const addResume = (resume) => {
        setResumes(prev => [resume, ...prev]);
        setRecentResume(resume);
    };
    const updateResume = (id, updatedResume) => {
        setResumes(prev => prev.map(resume => resume._id === id ? updatedResume : resume));
        if (recentResume?._id === id) {
            setRecentResume(updatedResume);
        }
    };
    const deleteResume = (id) => {
        setResumes(prev => prev.filter(resume => resume._id !== id));
        if (recentResume?._id === id) {
            const remainingResumes = resumes.filter(resume => resume._id !== id);
            setRecentResume(remainingResumes.length > 0 ? remainingResumes[0] : null);
        }
    };
    // Don't auto-fetch in context - let components handle it
    // This prevents race conditions and premature clearing of resumes
    // Components will call fetchResumes when they're ready
    const value = {
        resumes,
        recentResume,
        isLoading,
        fetchResumes,
        addResume,
        updateResume,
        deleteResume,
    };
    return (<ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>);
};
