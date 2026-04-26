import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
const testimonials = [
    {
        id: 1,
        content: "FutureFind completely transformed my job search. The resume builder helped me optimize my CV with the right keywords and I landed interviews at 3 top companies within a week!",
        author: "Alex Chen",
        title: "Software Engineer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5
    },
    {
        id: 2,
        content: "The mock interview feature was a game changer for me. It helped me practice tough questions and get real-time feedback. I felt so much more confident in my actual interviews.",
        author: "Sarah Johnson",
        title: "Marketing Specialist",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5
    },
    {
        id: 3,
        content: "I was struggling to identify what skills I needed for a career change. The skill gap analysis pointed me to exactly what courses I needed, and now I've successfully transitioned into data science.",
        author: "Michael Rodriguez",
        title: "Data Analyst",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 4
    },
    {
        id: 4,
        content: "The personalized job recommendations were spot on! Instead of sorting through hundreds of listings, FutureFind matched me with positions that were perfect for my experience and interests.",
        author: "Priya Sharma",
        title: "UX Designer",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        rating: 5
    },
];
const TestimonialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemsPerPage = 2;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);
    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };
    const handleNext = () => {
        setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };
    const startIndex = activeIndex * itemsPerPage;
    const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);
    return (<section className="py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold hero-text-gradient">
            Success Stories
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            See how FutureFind has helped job seekers advance their careers
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row gap-8">
            {visibleTestimonials.map((testimonial) => (<div key={testimonial.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8 flex-1 animate-slide-up">
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} size={18} className="text-yellow-400 fill-yellow-400"/>))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (<Star key={i + testimonial.rating} size={18} className="text-gray-300 dark:text-gray-600"/>))}
                </div>
                
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4"/>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </div>))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, index) => (<button key={index} onClick={() => setActiveIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === index
                ? 'bg-brand-600 dark:bg-brand-400'
                : 'bg-gray-300 dark:bg-gray-600'}`} aria-label={`Go to slide ${index + 1}`}/>))}
          </div>

          <div className="hidden md:block">
            <Button size="icon" variant="outline" onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 -left-4 rounded-full">
              <ChevronLeft className="h-5 w-5"/>
            </Button>
            <Button size="icon" variant="outline" onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 -right-4 rounded-full">
              <ChevronRight className="h-5 w-5"/>
            </Button>
          </div>
        </div>
      </div>
    </section>);
};
export default TestimonialsSection;
