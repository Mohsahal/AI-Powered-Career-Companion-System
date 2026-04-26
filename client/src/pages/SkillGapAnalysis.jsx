import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock,
    FileText, 
    Target, 
    ArrowRight, 
    Zap, 
    Sparkles, 
    Download, 
    BarChart2, 
    Youtube, 
    Loader2, 
    Eye,
    ChevronRight,
    Search,
    Trash2,
    ArrowLeft,
    Home,
    Upload
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitResumeForSkillGap } from "@/config/api";

// Demo data for Skill Gap Analysis
const DEMO_DATA = {
  success: true,
  message: "Demo skill gap analysis completed successfully!",
  analysis: {
    present_skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
    missing_skills: ["Docker", "AWS", "CI/CD"],
    additional_skills: ["HTML", "CSS"],
    skill_analysis: {
      JavaScript: { status: "present", importance: "high", level: "intermediate", evidence: "" },
      React: { status: "present", importance: "high", level: "beginner", evidence: "" },
      Docker: { status: "missing", importance: "high", level: "beginner", evidence: "" },
    },
    summary: {
      total_skills_required: 8,
      skills_present: 5,
      skills_missing: 3,
      completion_percentage: 62.5,
    },
  },
  learning_resources: {
    youtube_videos: {},
    recommendations: [
      {
        skill: "Docker",
        type: "devops_tool",
        resources: ["Complete Docker course on Docker Academy", "Containerize applications", 'Read "Docker in Action"'],
        estimated_time: "1-2 months",
        priority: "high",
      },
    ],
  },
};
export default function SkillGapAnalysisPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showDemo, setShowDemo] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleAnalyze = async () => {
        if (!selectedFile || !jobDescription.trim()) {
            toast({
                title: "Missing Information",
                description: "Please select a resume file and enter a job description.",
                variant: "destructive",
            });
            return;
        }
        setIsAnalyzing(true);
        try {
            const data = await submitResumeForSkillGap(selectedFile, jobDescription);
            if (!data?.success || !data?.analysis) throw new Error(data?.error || data?.message || "Analysis failed");
            setAnalysisResult(data);
            setShowDemo(false);
            toast({
                title: "Skill Gap Analysis Complete",
                description: data.message || "Done",
            });
        }
        catch (error) {
            console.error('Analysis failed:', error);
            toast({
                title: "Analysis Failed",
                description: error instanceof Error ? error.message : 'An error occurred during analysis',
                variant: "destructive",
            });
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    const showDemoData = () => {
        setAnalysisResult(DEMO_DATA);
        setShowDemo(true);
        toast({
            title: "Demo Mode",
            description: "Showing sample skill gap analysis data",
        });
    };
    const resetAnalysis = () => {
        setSelectedFile(null);
        setJobDescription("");
        setAnalysisResult(null);
        setShowDemo(false);
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4"/>
                Back to Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
                <Home className="h-4 w-4"/>
                Home
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
              <p className="text-gray-500">Analyze your skills against job requirements</p>
            </div>
            <div className="flex gap-2">
              {!analysisResult && (<Button variant="outline" size="sm" onClick={showDemoData}>
                  <Eye className="mr-2 h-4 w-4"/>
                  View Demo
                </Button>)}
              {analysisResult && (<Button variant="outline" size="sm" onClick={resetAnalysis}>
                  <Trash2 className="mr-2 h-4 w-4"/>
                  {showDemo ? 'Close Demo' : 'New Analysis'}
                </Button>)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Demo Notice */}
          {showDemo && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Eye className="h-5 w-5"/>
                <span className="font-medium">Demo Mode</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                This is sample data to demonstrate the skill gap analysis feature. Upload your actual resume and job description to get personalized results.
              </p>
            </div>)}

          {/* Resume Upload Section */}
          {!analysisResult && (<Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <FileText className="h-8 w-8"/>
                  Resume Upload for Skill Analysis
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Upload your resume and provide a job description to analyze your skill gaps
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="resume-file" className="text-base font-medium">Upload Resume</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                        <p className="text-gray-600 mb-4">
                          Drag and drop your resume here, or click to browse
                        </p>
                        <Input id="resume-file" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden"/>
                        <Button variant="outline" size="lg" onClick={() => document.getElementById('resume-file')?.click()}>
                          Choose File
                        </Button>
                      </div>
                      {selectedFile && (<div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4"/>
                          {selectedFile.name}
                        </div>)}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="job-description" className="text-base font-medium">Job Description</Label>
                      <Textarea id="job-description" placeholder="Paste the job description you want to analyze against..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-[200px] text-base"/>
                      <p className="text-sm text-gray-500">
                        This helps us identify skills you need to develop for this position
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleAnalyze} disabled={!selectedFile || !jobDescription.trim() || isAnalyzing} size="lg" className="px-8">
                      {isAnalyzing ? (<>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
                          Analyzing Skills...
                        </>) : (<>
                          <Target className="h-5 w-5 mr-2"/>
                          Analyze Skill Gap
                        </>)}
                    </Button>
                    
                    <Button variant="outline" onClick={showDemoData} size="lg" className="px-8">
                      <Eye className="h-5 w-5 mr-2"/>
                      Try Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}

          {/* Analysis Results */}
          {analysisResult && analysisResult.analysis && (<div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analysisResult.analysis.summary.completion_percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Skill Match</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">{analysisResult.analysis.summary.skills_present}</div>
                    <div className="text-sm text-gray-600">Skills Present</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-red-600 mb-2">{analysisResult.analysis.summary.skills_missing}</div>
                    <div className="text-sm text-gray-600">Skills Missing</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{analysisResult.analysis.summary.total_skills_required}</div>
                    <div className="text-sm text-gray-600">Total Required</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">Overall Match</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {analysisResult.analysis.summary.completion_percentage}%
                      </span>
                    </div>
                    <Progress value={analysisResult.analysis.summary.completion_percentage} className="h-4"/>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="skills">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="h-5 w-5"/>
                          Skills You Have
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(analysisResult.analysis.present_skills || []).length > 0 ? ((analysisResult.analysis.present_skills || []).map((skill, index) => (<Badge key={index} variant="outline" className="bg-green-100 text-green-800 text-sm px-3 py-1">
                                <CheckCircle2 className="h-3 w-3 mr-1"/>
                                {skill}
                              </Badge>))) : (<p className="text-gray-500 text-sm">No matching skills detected.</p>)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5"/>
                          Missing Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(analysisResult.analysis.missing_skills || []).length > 0 ? ((analysisResult.analysis.missing_skills || []).map((skill, index) => (<Badge key={index} variant="outline" className="bg-red-100 text-red-800 text-sm px-3 py-1">
                                <AlertCircle className="h-3 w-3 mr-1"/>
                                {skill}
                              </Badge>))) : (<p className="text-gray-500 text-sm">No missing skills detected.</p>)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart2 className="h-5 w-5 text-career-purple" />
                          Detailed Skill Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th className="px-4 py-3">Skill</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Importance</th>
                                <th className="px-4 py-3">Level</th>
                                <th className="px-4 py-3">Evidence / Note</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {Object.entries(analysisResult.analysis.skill_analysis || {}).map(([skill, data]) => (
                                <tr key={skill} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 font-medium text-gray-900">{skill}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline" className={
                                      data.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' :
                                      data.status === 'missing' ? 'bg-red-50 text-red-700 border-red-200' :
                                      'bg-blue-50 text-blue-700 border-blue-200'
                                    }>
                                      {data.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold ${
                                      data.importance === 'high' ? 'text-red-600' :
                                      data.importance === 'medium' ? 'text-orange-600' :
                                      'text-green-600'
                                    }`}>
                                      {data.importance.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">{data.level}</td>
                                  <td className="px-4 py-3 text-gray-500 italic">{data.evidence}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Skills Detected</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(analysisResult.analysis.additional_skills || []).length ? (
                          analysisResult.analysis.additional_skills.map((x, i) => (
                            <Badge key={i} variant="secondary" className="mr-2 mb-2">{x}</Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No additional relevant skills found.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>AI Summary & Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
                          <strong>Match Percentage:</strong> {analysisResult.analysis.summary.completion_percentage}%
                        </div>
                        <p className="text-gray-600 text-sm">
                          This analysis was performed by Gemini 2.0 Flash. It evaluates the semantic overlap between your resume and the job requirements. 
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Resume Text Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-900 rounded-lg p-4 text-gray-300 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-gray-800 shadow-inner">
                          {analysisResult.resume_text_preview || "—"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="suggestions">
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-career-blue" />
                          Learning Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {(analysisResult.analysis?.learning_resources?.recommendations || []).length ? (
                          (analysisResult.analysis.learning_resources.recommendations.map((rec, i) => (
                            <div key={i} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-lg text-gray-900">{rec.skill}</div>
                                <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                                  {rec.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="text-sm text-blue-600 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Estimated time: {rec.estimated_time}
                              </div>
                              <div className="space-y-1">
                                {rec.resources.map((res, idx) => (
                                  <div key={idx} className="text-sm text-gray-700 flex gap-2">
                                    <span className="text-blue-500">•</span> {res}
                                  </div>
                                ))}
                              </div>
                              {rec.youtube_query && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-4 w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                  onClick={() => window.open(rec.youtube_query, '_blank')}
                                >
                                  Search Tutorials on YouTube
                                </Button>
                              )}
                            </div>
                          )))
                        ) : (
                          <p className="text-gray-500 text-sm">No specific recommendations available.</p>
                        )}
                      </CardContent>
                    </Card>

                  </div>
                </TabsContent>
              </Tabs>
            </div>)}
        </div>
      </div>
    </div>);
}
