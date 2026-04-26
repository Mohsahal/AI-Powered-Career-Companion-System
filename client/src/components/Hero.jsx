import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
    const { isAuthenticated } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    return (<div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-24 pb-16 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-70"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-brand-100 dark:bg-brand-900/20 blur-3xl opacity-70"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Content: Text */}
          <div className="lg:col-span-6 sm:text-center lg:text-left">
            <div className="animate-slide-up">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300">
                <span className="w-2 h-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                AI-Powered Career Advancement
              </span>
            </div>
            
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold hero-text-gradient animate-slide-up animate-delay-100">
              Find Your Dream Job with AI
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 animate-slide-up animate-delay-200">
              Harness the power of AI to optimize your resume, analyze your skills, practice interviews, and get matched to your perfect job opportunities.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 animate-slide-up animate-delay-300">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" className="relative group overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className={`ml-2 transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`}/>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-brand-500 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                </Button>
              </Link>
              
              <Link to="/features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 animate-slide-up animate-delay-400">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Trusted by job seekers from
              </p>
              <div className="mt-3 flex flex-wrap gap-5 justify-center lg:justify-start">
                {/* Company logos (grayscale) */}
                <img className="h-8 opacity-60 hover:opacity-100 transition-opacity" src="https://assets.maccarianagency.com/svg/logos/airbnb-original.svg" alt="Airbnb"/>
                <img className="h-8 opacity-60 hover:opacity-100 transition-opacity" src="https://assets.maccarianagency.com/svg/logos/amazon-original.svg" alt="Amazon"/>
                <img className="h-8 opacity-60 hover:opacity-100 transition-opacity" src="https://assets.maccarianagency.com/svg/logos/google-original.svg" alt="Google"/>
                <img className="h-8 opacity-60 hover:opacity-100 transition-opacity" src="https://assets.maccarianagency.com/svg/logos/netflix-original.svg" alt="Netflix"/>
              </div>
            </div>
          </div>
          
          {/* Right Content: Image/Illustration */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 flex justify-center items-center">
            <div className="relative mx-auto w-full max-w-lg animate-float">
              {/* Dashboard Preview */}
              <div className="relative rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="h-8 bg-gray-100 dark:bg-gray-700 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-4 sm:p-6">
                  {/* Dashboard Content */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center">
                        <svg className="h-6 w-6 text-brand-600 dark:text-brand-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 mt-2 rounded"></div>
                      </div>
                    </div>
                    <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                      <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-10 -right-8 w-40 h-40 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 animate-float">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    <div className="transform rotate-12">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      <div className="text-xs mt-1 text-center">AI Resume</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center shadow-lg transform rotate-12 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                    <div className="transform -rotate-12">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                      <div className="text-xs mt-1 text-center">Mock Interview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="currentColor" fillOpacity="1" className="text-white dark:text-gray-900" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
    </div>);
};
export default Hero;
