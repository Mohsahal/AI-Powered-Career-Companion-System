import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import AuthBackground from "@/components/auth/AuthBackground";
import AnimatedTransition from "@/components/auth/AnimatedTransition";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("login");
    const { login, signup, isLoading, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }
        try {
            await login(loginData.email, loginData.password);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (!signupData.name || !signupData.email || !signupData.password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupData.email)) {
            toast({
                title: "Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }
        if (signupData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }
        try {
            await signup(signupData.email, signupData.password, signupData.name);
            setLoginData((prev) => ({ ...prev, email: signupData.email }));
            setSignupData({ name: "", email: "", password: "" });
            setActiveTab("login");
            toast({
                title: "Success",
                description: "Account created successfully! Please sign in with your new credentials.",
            });
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-5/12 bg-gradient-to-br from-[#A044F5] to-[#7c3aed] text-white relative overflow-hidden flex items-center justify-center p-8"
            >
                <AuthBackground />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {activeTab === "login" ? "Welcome Back!" : "Hello, Friend!"}
                        </h1>
                        <p className="text-base md:text-lg mb-8 opacity-90 max-w-sm mx-auto">
                            {activeTab === "login"
                                ? "To keep connected with us please login with your personal info"
                                : "Enter your personal details and start your journey with us"}
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#A044F5] transition-all px-10 py-3 rounded-full text-lg font-semibold"
                            >
                                {activeTab === "login" ? "SIGN UP" : "SIGN IN"}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-7/12 bg-white flex items-center justify-center p-6 md:p-12"
            >
                <div className="w-full max-w-md">
                    <AnimatedTransition>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                                {activeTab === "login" ? "Sign in to Account" : "Create Account"}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {activeTab === "login"
                                    ? "Enter your email and password to sign in"
                                    : "Enter your details to create an account"}
                            </p>
                        </div>
                    </AnimatedTransition>

                    {activeTab === "login" ? (
                        <motion.form
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleLoginSubmit}
                            className="space-y-5"
                        >
                            <motion.div variants={itemVariants} className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className="pl-12 py-6 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#A044F5] focus-visible:ring-offset-0"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="pl-12 py-6 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#A044F5] focus-visible:ring-offset-0"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="text-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/forgot-password"
                                        className="text-gray-600 text-sm hover:text-[#A044F5] transition-colors"
                                    >
                                        Forgot your password?
                                    </Link>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#A044F5] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#A044F5] text-white py-6 rounded-full text-lg font-semibold transition-all"
                                >
                                    {isLoading ? "Signing in..." : "SIGN IN"}
                                </Button>
                            </motion.div>
                        </motion.form>
                    ) : (
                        <motion.form
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSignupSubmit}
                            className="space-y-5"
                        >
                            <motion.div variants={itemVariants} className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                    className="pl-12 py-6 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#A044F5] focus-visible:ring-offset-0"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    className="pl-12 py-6 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#A044F5] focus-visible:ring-offset-0"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    className="pl-12 py-6 bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-[#A044F5] focus-visible:ring-offset-0"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#A044F5] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#A044F5] text-white py-6 rounded-full text-lg font-semibold transition-all"
                                >
                                    {isLoading ? "Creating account..." : "SIGN UP"}
                                </Button>
                            </motion.div>
                        </motion.form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
