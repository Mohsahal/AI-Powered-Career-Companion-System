import { FileText, Search, BarChart, Mic, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
const FeaturesSection = () => {
    const { isAuthenticated } = useAuth();
    const features = [
        {
            id: 'resume-builder',
            icon: <FileText size={28}/>,
            title: 'Smart Resume Builder',
            description: 'Create professional resumes with AI-powered keyword optimization to pass through ATS systems and catch recruiters\' attention.',
            color: 'from-blue-500 to-brand-600',
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&q=80&w=600&h=400&auto=format&fit=crop'
        },
        {
            id: 'job-recommendations',
            icon: <Search size={28}/>,
            title: 'ATS Match Evaluation',
            description: 'Upload your resume and compare it to a job description with Gemini-powered semantic analysis. Get a match score, missing skills, strengths, weaknesses, and improvement suggestions (strict JSON).',
            color: 'from-purple-500 to-pink-600',
            image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&q=80&w=600&h=400&auto=format&fit=crop'
        },
        {
            id: 'skill-analysis',
            icon: <BarChart size={28}/>,
            title: 'Skill Gap Analysis',
            description: 'Identify the skills you need to develop for your dream roles, with personalized course recommendations to bridge those gaps.',
            color: 'from-amber-500 to-red-600',
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&q=80&w=600&h=400&auto=format&fit=crop'
        },
        {
            id: 'mock-interview',
            icon: <Mic size={28}/>,
            title: 'Voice Interview Assistant',
            description: 'Practice interviews with our AI-powered voice assistant that provides real-time feedback on your responses and body language.',
            color: 'from-green-500 to-emerald-600',
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&q=80&w=600&h=400&auto=format&fit=crop'
        }
    ];
    return (<section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold hero-text-gradient mb-6">
            Supercharge Your Job Search
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-16">
            Our AI-powered tools help you find and land your dream job faster than ever before
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {features.map((feature, index) => (<div key={feature.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="relative h-56 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-80 transition-opacity duration-300 group-hover:opacity-70`}></div>
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                <Link to={isAuthenticated ? `/dashboard/${feature.id}` : `/features#${feature.id}`} className="inline-flex items-center font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  Learn more <ChevronRight className="ml-1 h-4 w-4"/>
                </Link>
              </div>
            </div>))}
        </div>

        <div className="mt-16 text-center">
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button size="lg" className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>);
};
export default FeaturesSection;
