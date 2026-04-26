import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight, FileCheck, FileText, Plus, Download, Share2, Eye, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useResume } from '@/contexts/ResumeContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";
function ResumeBuilder() {
    const { recentResume, isLoading, fetchResumes } = useResume();
    const navigate = useNavigate();
    const formatLastModified = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        }
        catch {
            return 'Recently';
        }
    };
    const newResume = () => {
        navigate("/resume-builder");
    };
    const handlePreview = (id) => {
        navigate(`/resume-preview/${id}`);
    };
    // Add a focus listener to refresh data when user returns to the tab
    useEffect(() => {
        const handleFocus = () => {
            // Refresh resumes when user returns to the tab
            fetchResumes();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchResumes]);
    return (<div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Resume Builder
          </h2>
          <p className="text-gray-600">Create professional resumes with our easy-to-use builder and templates.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/my-resumes" className="flex items-center gap-2">
              <FileText className="h-4 w-4"/>
              My Resumes
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchResumes(true)} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button size="sm" asChild>
            <Link to="/resume-builder" className="flex items-center gap-2">
              Go to Builder
              <ArrowRight className="h-4 w-4"/>
            </Link>
          </Button>
        </div>
      </div>
      

      {/* Main Resume Builder Card */}
      <Card className="bg-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:scale-110 transition-all duration-300">
              <FileCheck className="h-6 w-6 text-career-blue"/>
            </div>
            <div>
              <CardTitle className="text-lg">Create Your Resume</CardTitle>
              <p className="text-gray-600 text-sm">Choose how you'd like to start building your resume</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-28 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-career-blue transition-all duration-200 group border-gray-200" onClick={newResume}>
              <div className="p-2 bg-career-blue rounded-full group-hover:scale-110 transition-all duration-200">
                <Plus className="h-4 w-4 text-white"/>
              </div>
              <span className="font-medium text-sm">New Resume</span>
              <span className="text-xs text-gray-500">Start from scratch</span>
            </Button>
            
            <Button variant="outline" className="h-28 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-career-purple transition-all duration-200 group border-gray-200" onClick={() => navigate('/resume-builder?tab=templates')}>
              <div className="p-2 bg-career-purple rounded-full group-hover:scale-110 transition-all duration-200">
                <FileText className="h-4 w-4 text-white"/>
              </div>
              <span className="font-medium text-sm">Templates</span>
              <span className="text-xs text-gray-500">Choose from 6+ designs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Resume Section */}
      <Card className="bg-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-lg">Recent Resume</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-gray-100 transition-colors" onClick={() => { handlePreview(recentResume._id); }}>
                <Eye className="h-4 w-4 mr-2"/>
                Preview
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-gray-100 transition-colors">
                <Download className="h-4 w-4 mr-2"/>
                Download
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-gray-100 transition-colors">
                <Share2 className="h-4 w-4 mr-2"/>
                Share
              </Button>
            </div>
          </div>
          
          {isLoading ? (<div className="flex items-center justify-center p-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-career-blue rounded-full animate-spin"></div>
            </div>) : recentResume ? (<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-16 bg-career-blue rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-white"/>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">{recentResume.title}</h5>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4"/>
                  <span>Last updated: {formatLastModified(recentResume.lastModified)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {recentResume.template}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300">
                    {recentResume.personalInfo.firstName} {recentResume.personalInfo.lastName}
                  </Badge>
                </div>
              </div>
            </div>) : (<div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileText className="h-8 w-8 text-gray-400"/>
              </div>
              <h5 className="font-medium text-gray-900 mb-2">No resumes yet</h5>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first professional resume to get started</p>
              <Button asChild>
                <Link to="/resume-builder" className="flex items-center gap-2">
                  Create Resume
                </Link>
              </Button>
            </div>)}
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg group">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
            <FileCheck className="h-6 w-6 text-career-blue"/>
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Professional Templates</h4>
          <p className="text-gray-600 text-sm">6+ professionally designed templates for every industry</p>
        </Card>
        
        <Card className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg group">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
            <Eye className="h-6 w-6 text-green-600"/>
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Real-time Preview</h4>
          <p className="text-gray-600 text-sm">See your changes instantly as you build your resume</p>
        </Card>
        
        <Card className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg group">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
            <Download className="h-6 w-6 text-career-purple"/>
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Multiple Formats</h4>
          <p className="text-gray-600 text-sm">Export as PDF, Word, or share via link</p>
        </Card>
      </div>

    </div>);
}
export default ResumeBuilder;
