import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { API_ENDPOINTS } from "@/config/api";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    // Check if user is already logged in
    useEffect(() => {
        const verify = async () => {
            try {
                const storedUser = localStorage.getItem('futurefind_user');
                const token = localStorage.getItem('futurefind_token');
                if (!token) {
                    setUser(null);
                    return;
                }
                // Optimistically set stored user, then verify token with backend
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                const resp = await fetch(API_ENDPOINTS.PROFILE_ME, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) {
                    // Invalid/expired token → clear session
                    localStorage.removeItem('futurefind_user');
                    localStorage.removeItem('futurefind_token');
                    setUser(null);
                    return;
                }
                const json = await resp.json();
                if (json?.success && json?.data) {
                    setUser({
                        id: json.data.id || json.data._id,
                        email: json.data.email,
                        name: json.data.name,
                        profileImage: json.data.profileImage ?? null,
                    });
                    localStorage.setItem('futurefind_user', JSON.stringify({
                        id: json.data.id || json.data._id,
                        email: json.data.email,
                        name: json.data.name,
                        profileImage: json.data.profileImage ?? null,
                    }));
                }
                else {
                    localStorage.removeItem('futurefind_user');
                    localStorage.removeItem('futurefind_token');
                    setUser(null);
                }
            }
            catch (e) {
                // Network or other error: treat as unauthenticated
                localStorage.removeItem('futurefind_user');
                localStorage.removeItem('futurefind_token');
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        verify();
    }, []);
    // Get the authentication token
    const getToken = () => {
        return localStorage.getItem('futurefind_token');
    };
    // Login functionality
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            const userData = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                profileImage: data.user.profileImage
            };
            setUser(userData);
            localStorage.setItem('futurefind_user', JSON.stringify(userData));
            localStorage.setItem('futurefind_token', data.token);
            toast({
                title: "Login successful",
                description: `Welcome back, ${userData.name}!`,
            });
        }
        catch (error) {
            console.error('Login failed:', error);
            toast({
                title: "Login failed",
                description: error instanceof Error ? error.message : "Please check your credentials and try again.",
                variant: "destructive"
            });
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    // Google Login functionality
    const loginWithGoogle = async (token, userData) => {
        setIsLoading(true);
        try {
            setUser(userData);
            localStorage.setItem('futurefind_user', JSON.stringify(userData));
            localStorage.setItem('futurefind_token', token);
            toast({
                title: "Login successful",
                description: `Welcome back, ${userData.name}!`,
            });
        }
        catch (error) {
            console.error('Google login failed:', error);
            toast({
                title: "Login failed",
                description: error instanceof Error ? error.message : "Google authentication failed.",
                variant: "destructive"
            });
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    // Signup functionality
    const signup = async (email, password, name) => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            // Don't set user data or token after signup - user needs to login separately
            // setUser(userData);
            // localStorage.setItem('futurefind_user', JSON.stringify(userData));
            // localStorage.setItem('futurefind_token', data.token);
            toast({
                title: "Account created successfully",
                description: `Welcome to FutureFind, ${name}! Please sign in with your new account.`,
            });
        }
        catch (error) {
            console.error('Signup failed:', error);
            toast({
                title: "Signup failed",
                description: error instanceof Error ? error.message : "Please try again with different credentials.",
                variant: "destructive"
            });
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    // Logout functionality
    const logout = () => {
        setUser(null);
        localStorage.removeItem('futurefind_user');
        localStorage.removeItem('futurefind_token');
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
        // Use window.location.href to completely reset browser state and prevent back button issues
        window.location.href = '/auth';
    };
    return (<AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            loginWithGoogle,
            logout,
            getToken
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
