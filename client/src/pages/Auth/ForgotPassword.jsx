import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import AuthBackground from "@/components/auth/AuthBackground";
import AnimatedTransition from "@/components/auth/AnimatedTransition";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Basic validation
            if (!email) {
                toast({
                    title: "Error",
                    description: "Please enter your email address",
                    variant: "destructive",
                });
                return;
            }
            // Success notification
            toast({
                title: "Reset link sent",
                description: "Check your inbox for password reset instructions",
            });
            setIsSubmitted(true);
            // In a real app, this would send a reset link to the user's email
            console.log("Password reset requested for:", email);
        }, 1500);
    };
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };
    return (<div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Section - Gradient Background */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="w-full md:w-5/12 bg-gradient-to-br from-[#A044F5] to-[#7c3aed] text-white relative overflow-hidden flex items-center justify-center p-8">
        <AuthBackground />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Reset Password
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-90 max-w-sm mx-auto">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - White Background */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full md:w-7/12 bg-white flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/auth" className="flex items-center text-gray-600 mb-8 hover:text-[#A044F5] transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to login
            </Link>
          </motion.div>
          
          <AnimatedTransition>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-500">
                {isSubmitted
            ? "Check your email for the reset link"
            : "Enter your email to receive a password reset link"}
              </p>
            </div>
          </AnimatedTransition>

          {isSubmitted ? (<motion.div variants={formVariants} initial="hidden" animate="visible" className="text-center">
              <motion.div variants={itemVariants} className="mb-6 p-3 rounded-full bg-green-100 inline-flex items-center justify-center">
                <motion.svg initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </motion.svg>
              </motion.div>
              <motion.h3 variants={itemVariants} className="text-xl font-medium mb-2">
                Email sent successfully!
              </motion.h3>
              <motion.p variants={itemVariants} className="text-gray-600 mb-6">
                We've sent a password reset link to your email address. Please check your inbox.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Try again
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild>
                    <Link to="/auth">Return to login</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>) : (<motion.form variants={formVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="relative">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 py-6 bg-gray-50" required/>
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ✉️
                </span>
              </motion.div>
              
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#A044F5] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#A044F5] text-white py-6 rounded-full text-lg font-semibold transition-all">
                  {isLoading ? (<span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>) : "RESET PASSWORD"}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-gray-600">Remember your password?{" "}
                  <motion.span whileHover={{ scale: 1.05 }} style={{ display: "inline-block" }}>
                    <Link to="/auth" className="text-[#A044F5] hover:underline">
                      Back to login
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </motion.form>)}
        </div>
      </motion.div>
    </div>);
};
export default ForgotPassword;
