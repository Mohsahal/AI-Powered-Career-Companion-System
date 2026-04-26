import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, ApiClient } from "@/config/api";
import { Mail, Briefcase, MapPin, GraduationCap, Award, Phone, Globe, Github, Linkedin, Twitter, FileText, Trophy, Star, Camera, Settings, Plus, Trash2, LayoutDashboard, Loader2, Languages, Activity, CheckCircle2, Circle, ExternalLink, Clock, TrendingUp } from "lucide-react";
export default function Profile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({
        resumeCount: 0,
        interviewCount: 0,
        completedInterviews: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        title: "",
        location: "",
        phone: "",
        website: "",
        socials: {
            github: "",
            linkedin: "",
            twitter: ""
        },
        bio: "",
        education: "",
        skills: [],
        experience: "",
        languages: [],
        certifications: [],
        careerGoals: ""
    });
    const [newSkill, setNewSkill] = useState("");
    const [newLanguage, setNewLanguage] = useState("");
    const [newCertification, setNewCertification] = useState("");
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        pushNotifications: false,
        interviewReminders: true,
        productUpdates: true,
        twoFactorAuth: false
    });
    // Load profile data and statistics from backend
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const response = await ApiClient.get(API_ENDPOINTS.AUTH.PROFILE);
                if (response.success && response.data) {
                    const userData = response.data;
                    setProfileData({
                        name: userData.name || user?.name || "",
                        email: userData.email || user?.email || "",
                        title: userData.title || "",
                        location: userData.location || "",
                        phone: userData.phone || "",
                        website: userData.website || "",
                        socials: {
                            github: userData.socials?.github || "",
                            linkedin: userData.socials?.linkedin || "",
                            twitter: userData.socials?.twitter || ""
                        },
                        bio: userData.bio || "",
                        education: userData.education || "",
                        skills: userData.skills || [],
                        experience: userData.experience || "",
                        languages: userData.languages || [],
                        certifications: userData.certifications || [],
                        careerGoals: userData.careerGoals || ""
                    });
                }
            }
            catch (error) {
                console.error("Failed to load profile:", error);
                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive"
                });
            }
            finally {
                setIsLoading(false);
            }
        };
        const loadStats = async () => {
            try {
                // Load resume count
                const resumeResponse = await ApiClient.get(API_ENDPOINTS.RESUMES);
                const resumeCount = Array.isArray(resumeResponse) ? resumeResponse.length : 0;
                // Load interview count
                const interviewResponse = await ApiClient.get(API_ENDPOINTS.INTERVIEWS);
                const interviews = interviewResponse.success && Array.isArray(interviewResponse.data)
                    ? interviewResponse.data
                    : [];
                const interviewCount = interviews.length;
                // Get recent activity (last 5 resumes and interviews)
                const recentResumes = Array.isArray(resumeResponse)
                    ? resumeResponse.slice(0, 3).map((r) => ({
                        type: 'resume',
                        title: r.title || 'Untitled Resume',
                        date: r.lastModified || r.createdAt,
                        id: r._id || r.id
                    }))
                    : [];
                const recentInterviews = interviews.slice(0, 3).map((i) => ({
                    type: 'interview',
                    title: i.position || 'Mock Interview',
                    date: i.createdAt,
                    id: i._id || i.id
                }));
                setRecentActivity([...recentResumes, ...recentInterviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
                setStats({
                    resumeCount,
                    interviewCount,
                    completedInterviews: interviews.filter((i) => i.completed).length
                });
            }
            catch (error) {
                console.error("Failed to load statistics:", error);
            }
        };
        if (user) {
            loadProfile();
            loadStats();
        }
    }, [user, toast]);
    const profileCompletion = useMemo(() => {
        const checks = [
            !!profileData.name,
            !!profileData.email,
            !!profileData.title,
            !!profileData.location,
            !!profileData.bio,
            !!profileData.education,
            profileData.skills.length > 0,
            !!profileData.experience
        ];
        const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
        return Math.max(10, Math.min(score, 100));
    }, [profileData]);
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await ApiClient.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message || "Profile updated successfully"
                });
                setIsEditing(false);
                setActiveTab("overview"); // Redirect to overview tab after saving
            }
            else {
                throw new Error(response.message || "Failed to update profile");
            }
        }
        catch (error) {
            console.error("Failed to save profile:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save profile",
                variant: "destructive"
            });
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        // Reload profile data to discard changes
        const loadProfile = async () => {
            try {
                const response = await ApiClient.get(API_ENDPOINTS.AUTH.PROFILE);
                if (response.success && response.data) {
                    const userData = response.data;
                    setProfileData({
                        name: userData.name || user?.name || "",
                        email: userData.email || user?.email || "",
                        title: userData.title || "",
                        location: userData.location || "",
                        phone: userData.phone || "",
                        website: userData.website || "",
                        socials: {
                            github: userData.socials?.github || "",
                            linkedin: userData.socials?.linkedin || "",
                            twitter: userData.socials?.twitter || ""
                        },
                        bio: userData.bio || "",
                        education: userData.education || "",
                        skills: userData.skills || [],
                        experience: userData.experience || "",
                        languages: userData.languages || [],
                        certifications: userData.certifications || [],
                        careerGoals: userData.careerGoals || ""
                    });
                }
            }
            catch (error) {
                console.error("Failed to reload profile:", error);
            }
        };
        loadProfile();
        setIsEditing(false);
    };
    const addSkill = () => {
        const value = newSkill.trim();
        if (!value)
            return;
        if (profileData.skills.includes(value))
            return;
        setProfileData({ ...profileData, skills: [...profileData.skills, value] });
        setNewSkill("");
    };
    const removeSkill = (skill) => {
        setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
    };
    const addLanguage = () => {
        const value = newLanguage.trim();
        if (!value)
            return;
        if (profileData.languages.includes(value))
            return;
        setProfileData({ ...profileData, languages: [...profileData.languages, value] });
        setNewLanguage("");
    };
    const removeLanguage = (language) => {
        setProfileData({ ...profileData, languages: profileData.languages.filter(l => l !== language) });
    };
    const addCertification = () => {
        const value = newCertification.trim();
        if (!value)
            return;
        if (profileData.certifications.includes(value))
            return;
        setProfileData({ ...profileData, certifications: [...profileData.certifications, value] });
        setNewCertification("");
    };
    const removeCertification = (cert) => {
        setProfileData({ ...profileData, certifications: profileData.certifications.filter(c => c !== cert) });
    };
    const profileCompletionChecklist = useMemo(() => {
        return [
            { label: "Full Name", completed: !!profileData.name },
            { label: "Email", completed: !!profileData.email },
            { label: "Professional Title", completed: !!profileData.title },
            { label: "Location", completed: !!profileData.location },
            { label: "Bio", completed: !!profileData.bio },
            { label: "Education", completed: !!profileData.education },
            { label: "Experience", completed: !!profileData.experience },
            { label: "Skills", completed: profileData.skills.length > 0 },
            { label: "Languages", completed: profileData.languages.length > 0 },
            { label: "Career Goals", completed: !!profileData.careerGoals }
        ];
    }, [profileData]);
    const achievements = useMemo(() => {
        const ach = [];
        if (profileCompletion >= 100)
            ach.push({ name: "Complete Profile", icon: Star, color: "text-yellow-500" });
        if (stats.resumeCount >= 1)
            ach.push({ name: "Resume Creator", icon: FileText, color: "text-blue-500" });
        if (stats.interviewCount >= 5)
            ach.push({ name: "Interview Pro", icon: Trophy, color: "text-purple-500" });
        if (profileData.skills.length >= 10)
            ach.push({ name: "Skill Master", icon: Award, color: "text-green-500" });
        return ach;
    }, [profileCompletion, stats, profileData.skills.length]);
    if (isLoading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400"/>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 ">
      
      <div className="w-full px-3 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="w-full">
          {/* Profile Header */}
          <Card className="mb-6 sm:mb-8 overflow-hidden">
            <div className="h-24 sm:h-32 bg-gray-100"/>
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-white">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${(user?.name || 'User')}&color=black&size=512&font-size=0.4&bold=true`}/>
                    <AvatarFallback className="text-3xl">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md">
                    <Camera className="h-4 w-4"/>
                  </Button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (<div className="space-y-3">
                      <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="text-2xl sm:text-3xl font-bold text-center md:text-left" placeholder="Your Name"/>
                      <Input value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} className="text-gray-600 text-center md:text-left" placeholder="Your Title"/>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <Input value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} placeholder="Location" className="text-sm"/>
                        <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="Phone" className="text-sm"/>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <Input value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} placeholder="Website URL" className="text-sm"/>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-2">
                        <Input value={profileData.socials.github} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, github: e.target.value } })} placeholder="GitHub URL" className="text-sm"/>
                        <Input value={profileData.socials.linkedin} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, linkedin: e.target.value } })} placeholder="LinkedIn URL" className="text-sm"/>
                        <Input value={profileData.socials.twitter} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, twitter: e.target.value } })} placeholder="Twitter URL" className="text-sm"/>
                      </div>
                    </div>) : (<>
                      <h1 className="text-2xl sm:text-3xl font-bold">{profileData.name || "Your Name"}</h1>
                      <p className="text-gray-600">{profileData.title || "Your Title"}</p>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-3 text-gray-600">
                        {profileData.location && (<span className="flex items-center"><MapPin className="h-4 w-4 mr-2"/>{profileData.location}</span>)}
                        <span className="flex items-center"><Mail className="h-4 w-4 mr-2"/>{profileData.email}</span>
                        {profileData.phone && (<span className="flex items-center"><Phone className="h-4 w-4 mr-2"/>{profileData.phone}</span>)}
                      </div>
                      <div className="flex gap-3 justify-center md:justify-start mt-3">
                        {profileData.socials.github && (<a href={profileData.socials.github} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900"><Github className="h-5 w-5"/></a>)}
                        {profileData.socials.linkedin && (<a href={profileData.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900"><Linkedin className="h-5 w-5"/></a>)}
                        {profileData.socials.twitter && (<a href={profileData.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900"><Twitter className="h-5 w-5"/></a>)}
                        {profileData.website && (<a href={profileData.website} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900"><Globe className="h-5 w-5"/></a>)}
                      </div>
                    </>)}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (<>
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button variant="default" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (<>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                            Saving...
                          </>) : ("Save")}
                      </Button>
                    </>) : (<Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-6">
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
                    <div className="flex items-center gap-3">
                      <Progress value={profileCompletion} className="w-full"/>
                      <div className="text-sm font-semibold w-10 text-right">{profileCompletion}%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>Your professional summary and background</CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (<Textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Tell us about yourself..." rows={4}/>) : (<p className="text-gray-700">{profileData.bio || "No bio added yet."}</p>)}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-gray-400 mt-1"/>
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Education</div>
                          {isEditing ? (<Input value={profileData.education} onChange={(e) => setProfileData({ ...profileData, education: e.target.value })} placeholder="Your education" className="mt-1"/>) : (<div className="font-medium">{profileData.education || "Not specified"}</div>)}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-1"/>
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Experience</div>
                          {isEditing ? (<Input value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })} placeholder="Your experience" className="mt-1"/>) : (<div className="font-medium">{profileData.experience || "Not specified"}</div>)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your milestones</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1"><Trophy className="h-3 w-3" /> Top Performer</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Star className="h-3 w-3" /> {profileCompletion}% Profile</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><FileText className="h-3 w-3" /> Resume Pro</Badge>
          </CardContent>
        </Card> */}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Your technical and professional skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (<div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill) => (<span key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {skill}
                              <button aria-label={`Remove ${skill}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeSkill(skill)}>
                                <Trash2 className="h-3.5 w-3.5"/>
                              </button>
                            </span>))}
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addSkill() : undefined}/>
                          <Button type="button" onClick={addSkill}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                        </div>
                      </div>) : (<div className="flex flex-wrap gap-2">
                        {profileData.skills.length > 0 ? (profileData.skills.map((skill, index) => (<span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{skill}</span>))) : (<p className="text-gray-500 text-sm">No skills added yet.</p>)}
                      </div>)}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                    <CardDescription>Languages you speak</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (<div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {profileData.languages.map((lang) => (<span key={lang} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {lang}
                              <button aria-label={`Remove ${lang}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeLanguage(lang)}>
                                <Trash2 className="h-3.5 w-3.5"/>
                              </button>
                            </span>))}
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Add a language" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addLanguage() : undefined}/>
                          <Button type="button" onClick={addLanguage}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                        </div>
                      </div>) : (<div className="flex flex-wrap gap-2">
                        {profileData.languages.length > 0 ? (profileData.languages.map((lang, index) => (<span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
                              <Languages className="h-3 w-3"/> {lang}
                            </span>))) : (<p className="text-gray-500 text-sm">No languages added yet.</p>)}
                      </div>)}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Career Goals</CardTitle>
                  <CardDescription>Your professional aspirations and objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (<Textarea value={profileData.careerGoals} onChange={(e) => setProfileData({ ...profileData, careerGoals: e.target.value })} placeholder="Describe your career goals and aspirations..." rows={4}/>) : (<p className="text-gray-700">{profileData.careerGoals || "No career goals added yet."}</p>)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Professional certifications and credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (<div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {profileData.certifications.map((cert) => (<span key={cert} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            <Award className="h-3.5 w-3.5"/>
                            {cert}
                            <button aria-label={`Remove ${cert}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeCertification(cert)}>
                              <Trash2 className="h-3.5 w-3.5"/>
                            </button>
                          </span>))}
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Add a certification" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addCertification() : undefined}/>
                        <Button type="button" onClick={addCertification}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                      </div>
                    </div>) : (<div className="flex flex-wrap gap-2">
                      {profileData.certifications.length > 0 ? (profileData.certifications.map((cert, index) => (<span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1">
                            <Award className="h-3 w-3"/> {cert}
                          </span>))) : (<p className="text-gray-500 text-sm">No certifications added yet.</p>)}
                    </div>)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your milestones and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {achievements.length > 0 ? (achievements.map((ach, index) => {
            const Icon = ach.icon;
            return (<Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-2">
                            <Icon className={`h-4 w-4 ${ach.color}`}/>
                            {ach.name}
                          </Badge>);
        })) : (<p className="text-gray-500 text-sm">Complete your profile to unlock achievements!</p>)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion Checklist</CardTitle>
                  <CardDescription>Complete these items to improve your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profileCompletionChecklist.map((item, index) => (<div key={index} className="flex items-center gap-3">
                        {item.completed ? (<CheckCircle2 className="h-5 w-5 text-green-500"/>) : (<Circle className="h-5 w-5 text-gray-300"/>)}
                        <span className={item.completed ? "text-gray-700" : "text-gray-400"}>{item.label}</span>
                      </div>))}
                  </div>
                </CardContent>
              </Card>
           
            </TabsContent>

            {/* Profile Edit */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="https://" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}/>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input id="github" placeholder="https://github.com/username" value={profileData.socials.github} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, github: e.target.value } })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/username" value={profileData.socials.linkedin} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, linkedin: e.target.value } })}/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input id="twitter" placeholder="https://twitter.com/username" value={profileData.socials.twitter} onChange={(e) => setProfileData({ ...profileData, socials: { ...profileData.socials, twitter: e.target.value } })}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}/>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input id="education" value={profileData.education} onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}/>
                    </div>
                      <div className="space-y-2">
                      <Label htmlFor="experience">Experience Summary</Label>
                      <Input id="experience" value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}/>
                      </div>
                    </div>
                  <div className="space-y-3">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill) => (<span key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {skill}
                          <button aria-label={`Remove ${skill}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeSkill(skill)}>
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </span>))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addSkill() : undefined}/>
                      <Button type="button" onClick={addSkill}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((lang) => (<span key={lang} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {lang}
                          <button aria-label={`Remove ${lang}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeLanguage(lang)}>
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </span>))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a language" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addLanguage() : undefined}/>
                      <Button type="button" onClick={addLanguage}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert) => (<span key={cert} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {cert}
                          <button aria-label={`Remove ${cert}`} className="text-gray-700/70 hover:text-gray-800" onClick={() => removeCertification(cert)}>
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </span>))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a certification" value={newCertification} onChange={(e) => setNewCertification(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? addCertification() : undefined}/>
                      <Button type="button" onClick={addCertification}><Plus className="h-4 w-4 mr-1"/> Add</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="careerGoals">Career Goals</Label>
                    <Textarea id="careerGoals" rows={4} value={profileData.careerGoals} onChange={(e) => setProfileData({ ...profileData, careerGoals: e.target.value })} placeholder="Describe your career goals and aspirations..."/>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (<>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                          Saving...
                        </>) : (<>
                          <Settings className="h-4 w-4 mr-2"/> Save Changes
                        </>)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5"/>
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest resumes and interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (<div className="space-y-4">
                      {recentActivity.map((item, index) => (<div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {item.type === 'resume' ? (<FileText className="h-5 w-5 text-blue-500"/>) : (<Briefcase className="h-5 w-5 text-purple-500"/>)}
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3"/>
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Link to={item.type === 'resume' ? `/resume-builder` : `/mock-interview`} className="text-blue-600 hover:text-blue-800">
                            <ExternalLink className="h-4 w-4"/>
                          </Link>
                        </div>))}
                    </div>) : (<div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300"/>
                      <p>No recent activity</p>
                      <p className="text-sm mt-2">Create a resume or start an interview to see activity here</p>
                    </div>)}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started quickly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/resume-builder">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2"/>
                        Create New Resume
                      </Button>
                    </Link>
                    <Link to="/mock-interview">
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="h-4 w-4 mr-2"/>
                        Start Mock Interview
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="h-4 w-4 mr-2"/>
                        View Dashboard
                      </Button>
                    </Link>
                    <Link to="/view-jobs">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2"/>
                        Browse Jobs
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Your profile statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Resumes</span>
                      <span className="font-bold text-lg">{stats.resumeCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Interviews</span>
                      <span className="font-bold text-lg">{stats.interviewCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Interviews</span>
                      <span className="font-bold text-lg">{stats.completedInterviews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profile Completion</span>
                      <span className="font-bold text-lg">{profileCompletion}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>);
}
