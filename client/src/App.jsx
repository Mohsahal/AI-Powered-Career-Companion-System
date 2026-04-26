import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import ResumeBuilder from "./pages/ResumeBuilder";
import SharedResume from "./pages/SharedResume";
import Auth from "./pages/Auth/Auth";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import MyResumes from "./pages/MyResumes";
import ViewAllJobs from "./pages/ViewAllJobs";
import InterviewDashboard from "./pages/MockInterview/InterviewDashboard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import Generate from "./components/MockInterview/generate";
import Dashboard from "./pages/Dashboard";
import CreateEditPage from "./components/MockInterview/Create-edit-page";
import MockLoadPage from "./pages/MockInterview/MockLoadPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ResumePreview from "@/pages/ResumePreview";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MockInterviewPage from "./pages/MockInterview/mock-interview-page";
import { Feedback } from "@/components/MockInterview/feedback";
import QuestionsPage from "./pages/MockInterview/QuestionsPage";
import ResourcesPage from "./pages/MockInterview/ResourcesPage";
import AboutMockPage from "./pages/MockInterview/AboutMockPage";
// import Header from "@/components/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotFound from "@/pages/NotFound";
import SkillGapAnalysisPage from "@/pages/SkillGapAnalysis";
// import SkillGap from "@/pages/SkillGap";
const queryClient = new QueryClient();
const googleClientId = import.meta?.env?.VITE_GOOGLE_CLIENT_ID ||
    "291026471342-9ecgtoolsoh9suc0vl5op1dkqvf2h0ra.apps.googleusercontent.com";
const App = () => (<GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ResumeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Routes>
                    {/* Public routes with MainLayout */}
                    <Route path="/" element={<MainLayout>
                          <HomePage />
                        </MainLayout>}/>
                    <Route path="/about" element={<MainLayout>
                          <AboutPage />
                        </MainLayout>}/>
                    <Route path="/features" element={<MainLayout>
                          <FeaturesPage />
                        </MainLayout>}/>
                    {/* Authentication routes - accessible to everyone */}
                    <Route path="/auth" element={<Auth />}/>
                    <Route path="/forgot-password" element={<ForgotPassword />}/>
                    {/* Note: Removed duplicate shared-resume route with encodedData */}{" "}
                    {/* <Route path="/shared-resume/:encodedData" element={<SharedResume />} /> */}
                    {/* Protected Routes - require authentication */}
                    {/* Using ProtectedRoute to wrap all routes that need auth */}
                    <Route path="/dashboard" element={<ProtectedRoute>
                          {/* Assuming Header is part of the protected layout */}
                          {/* <Header /> */}
                          <DashboardLayout>
                            <Dashboard />
                          </DashboardLayout>
                        </ProtectedRoute>}/>
                    <Route path="/dashboard/:feature" element={<ProtectedRoute>
                          {/* Assuming Header is part of the protected layout */}
                          {/* <Header /> */}
                          <DashboardLayout>
                            <Dashboard />
                          </DashboardLayout>
                        </ProtectedRoute>}/>
                    {/* Other protected routes */}
                    <Route path="/resume-builder" element={<ProtectedRoute>
                          <ResumeBuilder />
                        </ProtectedRoute>}/>
                    <Route path="/resume-builder/:id" element={<ProtectedRoute>
                          <ResumeBuilder />
                        </ProtectedRoute>}/>
                    <Route path="/my-resumes" element={<ProtectedRoute>
                          <MyResumes />
                        </ProtectedRoute>}/>
                    <Route path="/view-all-jobs" element={<ProtectedRoute>
                          <ViewAllJobs />
                        </ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>}/>
                    <Route path="/settings" element={<ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>}/>
                    <Route path="/skill-gap-analysis" element={<ProtectedRoute>
                          <SkillGapAnalysisPage />
                        </ProtectedRoute>}/>
                    {/* <Route
      path="/skill-gap"
      element={
        <ProtectedRoute>
          <SkillGap />
        </ProtectedRoute>
      }
    /> */}
                    <Route path="/resume-preview/:id" element={<ProtectedRoute>
                          <ResumePreview />
                        </ProtectedRoute>}/>
                    {/* Keep the shared-resume route with id parameter */}{" "}
                    <Route path="/shared-resume/:id" element={<SharedResume />}/>
                    <Route element={<Generate />} path="/generate">
                      <Route index element={<InterviewDashboard />}/>
                      <Route path=":interviewId" element={<CreateEditPage />}/>
                      <Route path="interview/:interviewId" element={<MockLoadPage />}/>
                      <Route path="interview/:interviewId/start" element={<MockInterviewPage />}/>
                      <Route path="feedback/:interviewId" element={<Feedback />}/>
                      {/* MockInterview top-level nav pages */}
                      <Route path="questions" element={<QuestionsPage />}/>
                    
                      <Route path="resources" element={<ResourcesPage />}/>
                      <Route path="about" element={<AboutMockPage />}/>
                    </Route>

                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />}/>
                  </Routes>
                </main>
              </div>
            </Router>
          </TooltipProvider>
        </ResumeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>);
export default App;
