import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
const CtaSection = () => {
    const { isAuthenticated } = useAuth();
    return (<section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 animate-gradient-x"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-4 border-white"></div>
        <div className="absolute top-40 -left-20 w-40 h-40 rounded-full border-4 border-white"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full border-4 border-white"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career Journey?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of job seekers who have already leveraged AI to find their perfect roles. 
            Your dream job is just a few clicks away.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 hover:text-brand-700">
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="bg-white text-brand-600 hover:bg-gray-100 hover:text-brand-700">
                Explore Features
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-white/80">
            No credit card required. Start with our free plan today.
          </p>
        </div>
      </div>
    </section>);
};
export default CtaSection;
