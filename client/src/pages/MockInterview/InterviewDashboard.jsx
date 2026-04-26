import { InterviewPin } from "@/components/MockInterview/pin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ArrowLeft, Target, TrendingUp, Users, BookOpen, CheckCircle, Star, Zap, Info } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDataRefresh } from "@/hooks/useDataRefresh";
import { API_ENDPOINTS, ApiClient } from "@/config/api";
export const InterviewDashboard = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [answersByInterview, setAnswersByInterview] = useState({});
    const { user, getToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const fetchInterviews = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();
            console.log("User ID:", user?.id);
            console.log("Token exists:", !!token);
            // First check if server is accessible
            try {
                const base = API_ENDPOINTS.INTERVIEWS.replace(/\/api\/interviews.*/, '');
                const healthCheck = await fetch(`${base}/health`);
                console.log("Server health check:", healthCheck.ok);
                if (!healthCheck.ok) {
                    throw new Error(`Server health check failed: ${healthCheck.status}`);
                }
            }
            catch (error) {
                console.error("Server not accessible:", error);
                toast.error("Server Error", {
                    description: "Cannot connect to server. Please check if server is running.",
                });
                setLoading(false);
                return;
            }
            const params = user?.id ? `?userId=${encodeURIComponent(user.id)}` : "";
            const res = await fetch(`${API_ENDPOINTS.INTERVIEWS}${params}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            if (!res.ok) {
                console.error("HTTP Error:", res.status, res.statusText);
                throw new Error(`Failed to fetch interviews: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            console.log("API Response:", data);
            const list = (Array.isArray(data) ? data : data.data || []).map((item) => ({
                id: item._id ?? item.id,
                position: item.position,
                description: item.description,
                experience: item.experience,
                userId: item.userId,
                techStack: item.techStack,
                questions: item.questions || [],
                createdAt: item.createdAt,
                updatedAt: item.updatedAt ?? item.updateAt,
            }));
            console.log("Processed interviews list:", list);
            console.log("List length:", list.length);
            setInterviews(list);
            // Fetch user answer counts per interview to determine completion status
            try {
                if (token && list.length > 0) {
                    const results = await Promise.all(list.map(async (it) => {
                        const resp = await ApiClient.getUserAnswersByInterview(it.id, token);
                        const count = resp.success && Array.isArray(resp.data) ? resp.data.length : 0;
                        return [it.id, count];
                    }));
                    const counts = {};
                    results.forEach(([id, count]) => {
                        counts[id] = count;
                    });
                    setAnswersByInterview(counts);
                }
                else {
                    setAnswersByInterview({});
                }
            }
            catch (e) {
                console.warn("Failed to fetch answers counts", e);
                setAnswersByInterview({});
            }
        }
        catch (error) {
            console.error("Error on fetching : ", error);
            toast.error("Error..", {
                description: "Something went wrong. Try again later.",
            });
        }
        finally {
            setLoading(false);
        }
    }, [user?.id, getToken]);
    // Fetch interviews when component mounts or when user/auth changes
    useEffect(() => {
        if (user?.id && isAuthenticated) {
            fetchInterviews();
        }
        else if (!isAuthenticated) {
            console.log("User not authenticated, skipping fetch");
        }
    }, [user?.id, isAuthenticated, fetchInterviews]);
    // Use the custom hook to refresh data when navigating back
    useDataRefresh('/generate', fetchInterviews, [user?.id, isAuthenticated]);
    const handleRefresh = () => {
        if (user?.id && isAuthenticated) {
            fetchInterviews();
        }
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    // Calculate dashboard statistics
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(i => (answersByInterview[i.id] || 0) > 0).length;
    const averageExperience = interviews.length > 0
        ? Math.round(interviews.reduce((sum, i) => sum + i.experience, 0) / interviews.length)
        : 0;
    const recentInterviews = interviews.filter(i => {
        const created = new Date(i.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length;
    return (<div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 px-6 py-3 border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700">
            <ArrowLeft className="h-4 w-4"/>
            Back to Dashboard
          </Button>
          
          <Link to={"/generate/create"}>
            <Button size="lg" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-career-blue to-career-purple hover:from-career-purple hover:to-career-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="h-5 w-5"/>
              Create New Interview
            </Button>
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-career-blue to-career-purple text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-md">
            <Zap className="h-4 w-4"/>
            AI-Powered Mock Interviews
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interview Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Master your interview skills with AI-powered mock interviews. Practice, improve, and land your dream job.
          </p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Interviews</p>
                  <p className="text-3xl font-bold text-gray-900">{totalInterviews}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-career-blue"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedInterviews}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Experience</p>
                  <p className="text-3xl font-bold text-career-purple">{averageExperience} yrs</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-career-purple"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-orange-600">{recentInterviews}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (<Card key={index} className="bg-white border-0 shadow-md">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-4"/>
                    <Skeleton className="h-3 w-full mb-2"/>
                    <Skeleton className="h-3 w-2/3 mb-4"/>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16"/>
                      <Skeleton className="h-6 w-20"/>
                    </div>
                  </CardContent>
                </Card>))}
            </div>) : interviews.length > 0 ? (<>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Interviews</h2>
                <Badge className="bg-gradient-to-r from-career-blue to-career-purple text-white border-0 px-3 py-1">
                  {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (<InterviewPin key={interview.id} interview={interview} isCompletedOverride={(answersByInterview[interview.id] || 0) > 0}/>))}
              </div>
            </>) : (<Card className="bg-white border-0 shadow-xl max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-career-blue/10 to-career-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-career-blue"/>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Interview Journey?
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Create your first AI-powered mock interview to practice and improve your skills. 
                  Get personalized feedback and track your progress over time.
                </p>
                
                <div className="space-y-4">
                  <Link to={"/generate/create"}>
                    <Button size="lg" className="w-full bg-gradient-to-r from-career-blue to-career-purple hover:from-career-purple hover:to-career-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Plus className="h-5 w-5 mr-2"/>
                      Create Your First Interview
                    </Button>
                  </Link>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500"/>
                      <span>AI-Powered Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500"/>
                      <span>Instant Feedback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-career-blue"/>
                      <span>Progress Tracking</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Enhanced Quick Actions Footer */}
        {interviews.length > 0 && (<div className="mt-16">
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Need More Practice?
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Explore our question bank, resources, and tips to ace your interviews
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/generate/questions">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <BookOpen className="h-4 w-4"/>
                    Question Bank
                  </Button>
                </Link>
                <Link to="/generate/resources">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <Users className="h-4 w-4"/>
                    Resources
                  </Button>
                </Link>
                <Link to="/generate/about">
                  <Button variant="outline" size="lg" className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <Info className="h-4 w-4"/>
                    About
                  </Button>
                </Link>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
export default InterviewDashboard;
