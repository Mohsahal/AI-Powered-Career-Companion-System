import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// removed progress loader for auto-sliding
import { Users, Award, BookOpen, Briefcase, CheckCircle, Calendar, Lightbulb, GraduationCap, ThumbsUp, Twitter, Linkedin, Github } from 'lucide-react';
const AboutPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // no play/pause/progress state
    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };
    // Slider slides for the tabs content
    const slides = [
        {
            id: 'mission',
            title: 'Our Mission',
            subtitle: 'Democratizing career advancement opportunities',
            icon: <BookOpen className="h-20 w-20 text-brand-600"/>,
            color: 'from-brand-500 to-purple-500',
            bgColor: 'bg-white',
            content: (<div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-gray-200 shadow-sm mb-8">
              <BookOpen className="h-20 w-20 text-brand-600"/>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-500 mb-6">
              Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              At FutureFind, we're on a mission to democratize career advancement opportunities through AI-powered tools that level the playing field for all job seekers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                    'Help 1 million job seekers secure their dream jobs by 2026',
                    'Reduce preparation time for interviews by 75%',
                    'Bridge skill gaps through AI-driven personalized learning',
                    'Make professional career coaching accessible to everyone'
                ].map((goal, index) => (<motion.div key={index} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }} className="flex items-start bg-white p-6 rounded-xl shadow-sm border border-brand-200">
                <div className="mr-4 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-500"/>
                </div>
                <p className="text-gray-700 leading-relaxed">{goal}</p>
              </motion.div>))}
          </div>
        </div>)
        },
        {
            id: 'story',
            title: 'Our Story',
            subtitle: 'From vision to reality - the journey of FutureFind',
            icon: <Calendar className="h-20 w-20 text-purple-600"/>,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-white',
            content: (<div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-gray-200 shadow-sm mb-8">
              <Calendar className="h-20 w-20 text-purple-600"/>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              FutureFind was founded in 2023 by a team of AI engineers, HR professionals, and career coaches who recognized a fundamental problem in the job market.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
                    { year: '2023', milestone: 'Founded in San Francisco with a vision to transform career advancement through AI' },
                    { year: '2024', milestone: 'Launched our core platform with Resume Builder and Mock Interview features' },
                    { year: '2025', milestone: 'Expanding globally with new skill analysis and job matching algorithms' }
                ].map((item, index) => (<motion.div key={index} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }} className="relative pl-12 border-l-4 border-purple-300">
                <div className="absolute left-[-8px] top-0 w-6 h-6 rounded-full bg-purple-500 border-4 border-white shadow-lg"></div>
                <h4 className="text-2xl font-bold text-purple-600 mb-2">{item.year}</h4>
                <p className="text-lg text-gray-700">{item.milestone}</p>
              </motion.div>))}
          </div>
        </div>)
        },
        {
            id: 'values',
            title: 'Our Values',
            subtitle: 'The principles that guide everything we do',
            icon: <Lightbulb className="h-20 w-20 text-blue-600"/>,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-white',
            content: (<div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-gray-200 shadow-sm mb-8">
              <Lightbulb className="h-20 w-20 text-blue-600"/>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 mb-6">
              Our Values
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Our core values guide everything we do at FutureFind, from product development to customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                    { icon: <ThumbsUp className="h-8 w-8 text-brand-600"/>, title: 'Accessibility', description: 'Making career advancement tools accessible to everyone, regardless of background or experience level.' },
                    { icon: <Award className="h-8 w-8 text-brand-600"/>, title: 'Excellence', description: 'Committed to delivering the highest quality tools and resources that truly make a difference.' },
                    { icon: <Users className="h-8 w-8 text-brand-600"/>, title: 'Community', description: 'Building a supportive community where job seekers can learn, grow, and succeed together.' },
                    { icon: <Briefcase className="h-8 w-8 text-brand-600"/>, title: 'Innovation', description: 'Constantly pushing the boundaries of what\'s possible with AI to solve real career challenges.' }
                ].map((value, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="mr-4 p-2 rounded-lg bg-blue-50">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{value.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>))}
          </div>
        </div>)
        }
    ];
    // Auto-advance slides every 4 seconds without loader/controls
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);
    return (<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      {/* Hero Section */}
      <section className="mx-auto px-4 py-16 md:py-24 max-w-6xl ">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">
            About FutureFind
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforming the way job seekers prepare, apply, and succeed in their career journeys with intelligent AI-powered tools.
          </p>
        </motion.div> */}
        
        {/* Mission & Values Slider */}
        <div className="relative overflow-hidden max-w-6xl mx-auto">
          {/* Main Slider */}
          <div className="relative max-w-4xl md:max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="text-center">
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
            {/* Slider controls removed per request */}
          </div>
          {/* Slide Indicators removed per request */}
                    </div>
      </section>
      
      {/* Team Section */}
      <section className="mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl mb-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The passionate minds behind FutureFind working to transform career advancement
          </p>
        </div>
        
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Team Member 1 */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-brand-500 flex items-center justify-center">
              <Users className="h-20 w-20 text-white"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">Alex Chen</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3">Co-Founder & CEO</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Former HR Tech executive with a passion for creating equitable access to career opportunities.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Twitter className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Linkedin className="h-5 w-5"/>
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Team Member 2 */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-gradient-to-r from-brand-500 to-blue-500 flex items-center justify-center">
              <Users className="h-20 w-20 text-white"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">Maya Johnson</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3">Co-Founder & CTO</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                AI researcher with expertise in natural language processing and conversational interfaces.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Twitter className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Github className="h-5 w-5"/>
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Team Member 3 */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="h-20 w-20 text-white"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">David Park</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3">Head of Product</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Career coach turned product leader with 10+ years of experience in career development.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Linkedin className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Twitter className="h-5 w-5"/>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Measuring our success by the success of those we help
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
            <p className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">75k+</p>
            <p className="text-gray-600 dark:text-gray-300">Successful Job Placements</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">250k+</p>
            <p className="text-gray-600 dark:text-gray-300">Mock Interviews Conducted</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">92%</p>
            <p className="text-gray-600 dark:text-gray-300">User Success Rate</p>
          </motion.div>
        </div>
      </section>
      
      {/* Partners & Recognitions */}
      <section className="mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl mb-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Partners & Recognitions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Proudly collaborating with industry leaders and recognized for our innovation
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-24">
            <Badge variant="outline" className="text-lg py-3 px-4 border-2">Partner One</Badge>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-24">
            <Badge variant="outline" className="text-lg py-3 px-4 border-2">Partner Two</Badge>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-24">
            <Badge variant="outline" className="text-lg py-3 px-4 border-2">Partner Three</Badge>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-24">
            <Badge variant="outline" className="text-lg py-3 px-4 border-2">Partner Four</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          <Badge className="text-sm py-1.5 bg-brand-100 hover:bg-brand-200 text-brand-800 dark:bg-brand-900 dark:text-brand-300">
            HR Tech Innovation Award 2024
          </Badge>
          <Badge className="text-sm py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Best AI Career Tool
          </Badge>
          <Badge className="text-sm py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Top Startup to Watch
          </Badge>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-brand-600 to-purple-600 p-12 rounded-3xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Career?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have accelerated their careers with FutureFind's AI-powered tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-brand-600 hover:bg-gray-100" size="lg">
              <GraduationCap className="mr-2 h-5 w-5"/>
              Sign Up Free
            </Button>
            <Button variant="outline" className="bg-white text-brand-600 hover:bg-gray-100" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>
    </div>);
};
export default AboutPage;
