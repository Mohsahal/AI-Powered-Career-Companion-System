import { FileText, Search, BarChart, Mic, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const FeaturesPage = () => {
    const { isAuthenticated } = useAuth();
    const features = [
        {
            id: 'resume-builder',
            title: 'Smart Resume Builder',
            icon: <FileText className="w-10 h-10"/>,
            description: 'Create professional resumes optimized for applicant tracking systems (ATS) and human reviewers. Our AI analyzes job descriptions to suggest the right keywords and content to help your resume stand out.',
            benefits: [
                'AI-powered keyword optimization',
                'Professional templates and designs',
                'Content suggestions based on job descriptions',
                'Grammar and phrasing improvements',
                'ATS compatibility check'
            ],
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&q=80&w=800&h=600&auto=format&fit=crop',
            color: 'bg-gradient-to-r from-blue-500 to-brand-600'
        },
        {
            id: 'job-recommendations',
            title: 'ATS Match Evaluation',
            icon: <Search className="w-10 h-10"/>,
            description: 'Upload your resume and compare it to a job description with Gemini-powered semantic analysis. Get a strict JSON output including match score, confidence, matching/missing skills, experience relevance, project relevance, strengths, weaknesses, and improvement suggestions.',
            benefits: [
                'Strict JSON match score (0–100) + confidence',
                'Matching vs missing skills',
                'Experience and project relevance assessment',
                'Strengths, weaknesses, and concise summary',
                'Actionable improvement suggestions'
            ],
            image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&q=80&w=800&h=600&auto=format&fit=crop',
            color: 'bg-gradient-to-r from-purple-500 to-pink-600'
        },
        {
            id: 'skill-analysis',
            title: 'Skill Gap Analysis',
            icon: <BarChart className="w-10 h-10"/>,
            description: 'Identify the skills you need to develop for your dream roles. Our AI compares your current skills against job requirements and suggests personalized learning paths with course recommendations to bridge those gaps.',
            benefits: [
                'Comprehensive skill gap identification',
                'Personalized learning path creation',
                'Course recommendations from top platforms',
                'Progress tracking and skill development',
                'Industry trends and in-demand skills insights'
            ],
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&q=80&w=800&h=600&auto=format&fit=crop',
            color: 'bg-gradient-to-r from-amber-500 to-red-600'
        },
        {
            id: 'mock-interview',
            title: 'Voice Interview Assistant',
            icon: <Mic className="w-10 h-10"/>,
            description: 'Practice interviews with our AI-powered voice assistant that provides real-time feedback on your responses. Prepare for tough questions specific to your industry and role, and improve your interview skills with personalized guidance.',
            benefits: [
                'Voice-based interactive mock interviews',
                'Industry and role-specific questions',
                'Real-time feedback on responses',
                'Body language and vocal tone analysis',
                'Interview performance improvement tips'
            ],
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&q=80&w=800&h=600&auto=format&fit=crop',
            color: 'bg-gradient-to-r from-green-500 to-emerald-600'
        }
    ];
    return (<div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Header section */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold hero-text-gradient mb-6">
            Powerful Features to Advance Your Career
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Our AI-powered tools help you optimize your job search, improve your resume, develop in-demand skills, and ace interviews.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button size="lg" className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700">
              {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Features List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-32">
          {features.map((feature, index) => (<div key={feature.id} id={feature.id} className="scroll-mt-24">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className={`absolute -inset-4 rounded-xl ${feature.color} opacity-10 blur-xl`}></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img src={feature.image} alt={feature.title} className="w-full h-auto object-cover"/>
                      <div className={`absolute top-0 left-0 right-0 h-1 ${feature.color}`}></div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, i) => (<li key={i} className="flex items-center gap-3">
                        <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0"/>
                        <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                      </li>))}
                  </ul>
                  <Link to={isAuthenticated ? `/dashboard/${feature.id}` : "/signup"}>
                    <Button className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700">
                      {isAuthenticated ? `Try ${feature.title}` : "Get Started"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
export default FeaturesPage;
