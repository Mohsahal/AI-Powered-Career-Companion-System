import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";

const ResumeBuilderLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'shadow-lg bg-white/90 backdrop-blur-md border-b border-gray-100' 
          : 'bg-white'
      }`}>
        <Header />
      </div>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default ResumeBuilderLayout; 