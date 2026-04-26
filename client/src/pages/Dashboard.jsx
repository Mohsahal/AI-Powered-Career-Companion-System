import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import StatsOverview from "@/components/Dashboard/StatsOverview";
import JobRecommendations from "@/components/Dashboard/JobRecommendations";
import ResumeBuilder from "@/components/Dashboard/ResumeBuilder";
import SkillGapAnalysis from "@/components/Dashboard/SkillGapAnalysis";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Index from "../components/MockInterview/Mockindex";
import Header from "@/components/Header";
import { API_ENDPOINTS } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
    const mainRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [jobMatches, setJobMatches] = useState(0);
    const [resumeScore, setResumeScore] = useState(82);
    const [interviewReadiness, setInterviewReadiness] = useState(68);
    const [activities, setActivities] = useState([
        { title: "Dashboard Ready", date: "Just now", status: "online" }
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("futurefind_token") || localStorage.getItem("authToken");
                if (!token) return;

                // Fetch interview scores from user-answers endpoint
                const res = await fetch(API_ENDPOINTS.USER_ANSWERS, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success && data.data && data.data.length > 0) {
                    const totalRating = data.data.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
                    const avgRating = (totalRating / data.data.length) * 10;
                    setInterviewReadiness(Math.round(avgRating));

                    // Generate real activities
                    const recentInterviews = data.data.slice(0, 3).map(ans => ({
                        title: `Mock Interview Answered`,
                        date: new Date(ans.createdAt || Date.now()).toLocaleDateString(),
                        status: "completed"
                    }));
                    setActivities(prev => [...recentInterviews, ...prev.slice(0, 1)]);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    const handleAtsScoreUpdate = (score) => {
        if (score) {
            setResumeScore(Number(score));
            setActivities(prev => [{
                title: "ATS Match Completed",
                date: "Just now",
                status: "success"
            }, ...prev]);
        }
    };


    return (<div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen}/>
      
      <main className="flex-1 overflow-y-auto" ref={mainRef}>
        <Header scrollContainerRef={mainRef}/>
        <div className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold animate-fade-in">Career Dashboard</h1>
                <p className="text-sm text-gray-500">Track your progress and AI-driven insights.</p>
              </div>
            </div>
            
            <StatsOverview 
                jobMatches={jobMatches} 
                resumeScore={resumeScore} 
                interviewReadiness={interviewReadiness} 
            />


            
            <Tabs defaultValue="all" className="mb-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="border-b border-gray-200">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-career-blue rounded-none data-[state=active]:shadow-none">
                    All Features
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="data-[state=active]:border-b-2 data-[state=active]:border-career-blue rounded-none data-[state=active]:shadow-none">
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger value="resume" className="data-[state=active]:border-b-2 data-[state=active]:border-career-blue rounded-none data-[state=active]:shadow-none">
                    Resume
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="data-[state=active]:border-b-2 data-[state=active]:border-career-blue rounded-none data-[state=active]:shadow-none">
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="interviews" className="data-[state=active]:border-b-2 data-[state=active]:border-career-blue rounded-none data-[state=active]:shadow-none">
                    Interviews
                  </TabsTrigger>
                </TabsList>
              </div>


              <TabsContent value="all" className="mt-6 animate-fade-in">
                <div className="space-y-8">
                  <div id="job-recommendations">
                    <JobRecommendations 
                        onJobsUpdated={(list) => setJobMatches(list.length)}
                        onScoreUpdated={handleAtsScoreUpdate}
                    />
                  </div>
                  <div id="resume-builder">
                    <ResumeBuilder />
                  </div>
                  <div id="skill-gap">
                    <SkillGapAnalysis />
                  </div>
                  <div id="mock-interviews">
                   <Index />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="jobs">
                <div className="mt-6">
                  <JobRecommendations onScoreUpdated={handleAtsScoreUpdate} />
                </div>
              </TabsContent>
              
              <TabsContent value="resume">
                <div className="mt-6">
                  <ResumeBuilder />
                </div>
              </TabsContent>
              
              <TabsContent value="skills">
                <div className="mt-6">
                  <SkillGapAnalysis />
                </div>
              </TabsContent>
              
              <TabsContent value="interviews">
                <div className="mt-6">
                  <Index />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>);
}
