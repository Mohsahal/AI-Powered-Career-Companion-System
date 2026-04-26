import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, CheckCircle, BarChart2, ArrowRight, Settings, TrendingUp, Users, Award, BookOpen, Headphones, Brain, Target as TargetIcon } from 'lucide-react';
const Index = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // Auto-advance slides every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    const slides = [
        {
            title: "AI-Powered Mock Interviews",
            subtitle: "Practice with confidence using our advanced interview simulator",
            icon: <Brain className="h-16 w-16 text-blue-600"/>,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-white"
        },
        {
            title: "Real-time Voice Analysis",
            subtitle: "Get instant feedback on your speaking skills and confidence",
            icon: <Mic className="h-16 w-16 text-green-600"/>,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-white"
        },
        {
            title: "Personalized Learning Path",
            subtitle: "Adaptive questions based on your performance and goals",
            icon: <TargetIcon className="h-16 w-16 text-purple-600"/>,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-white"
        },
        {
            title: "Progress Tracking & Analytics",
            subtitle: "Monitor your improvement with detailed insights and reports",
            icon: <TrendingUp className="h-16 w-16 text-orange-600"/>,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-white"
        }
    ];
    const stats = [
        { label: 'Questions Available', value: '500+', icon: <BookOpen className="h-5 w-5"/> },
        { label: 'Practice Sessions', value: '10,000+', icon: <Headphones className="h-5 w-5"/> },
        { label: 'Success Rate', value: '94%', icon: <Award className="h-5 w-5"/> },
        { label: 'Active Users', value: '25K+', icon: <Users className="h-5 w-5"/> }
    ];
    return (<div className="min-h-screen bg-white">
      {/* Hero Section with Slider */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
          {/* Main Slider */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full ${slides[currentSlide].bgColor} border-2 border-gray-200 shadow-sm mb-6 sm:mb-8`}>
                  {slides[currentSlide].icon}
                </div>
                <h1 className={`text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${slides[currentSlide].color} mb-4 sm:mb-6`}>
                  {slides[currentSlide].title}
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
                  {slides[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center">
            <Link to="/generate">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 mt-5 sm:px-8 py-4 sm:py-6 text-base sm:text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Practice Interview
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Indicators and loader removed for a cleaner design */}
      </div>

      {/* Stats Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 mb-16 sm:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-md mb-2 sm:mb-3 border border-gray-200">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 mb-16 sm:mb-24">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <Card className="bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white border-2 border-indigo-200 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <Mic className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600"/>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Voice-Based Practice</h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer interview questions naturally with your voice. Experience real-time transcription and get comfortable with speaking confidently.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <Card className="bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white border-2 border-green-200 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-600"/>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Instant Feedback</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive detailed feedback on your responses, including strengths, areas for improvement, and actionable suggestions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="text-center">
            <Card className="bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white border-2 border-purple-200 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                  <BarChart2 className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600"/>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your improvement over time with detailed analytics and performance metrics.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Final CTA Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 mb-16 sm:mb-24">
        <div className="text-center">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Ace Your Interview?</h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
                Join thousands of professionals who have improved their interview skills with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                <Link to="/generate">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Free Practice
                    <ArrowRight className="ml-2 h-5 w-5"/>
                  </Button>
                </Link>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-4  text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50">
                  <Settings className="mr-2 h-5 w-5"/>
                  Customize Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white py-8 sm:py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">© 2024 AI Interview Simulator</p>
          <p className="text-gray-500">Your AI-powered interview preparation partner</p>
        </div>
      </footer>
    </div>);
};
export default Index;
