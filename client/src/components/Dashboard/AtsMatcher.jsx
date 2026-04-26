import {
  ArrowRight,
  Loader2,
  Star,
  Upload,
  FileText,
  X,
  Eye,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { submitResumeForAts } from "@/config/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function JobCardSkeleton() {
  return (
    <div className="border-2 border-gray-100 rounded-lg bg-white p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-56 mb-2" />
          <Skeleton className="h-5 w-16 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}

export default function JobRecommendations({ onJobsUpdated, onScoreUpdated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // no-op (kept to avoid layout jump on mount)
  }, []);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF, DOCX or TXT file", variant: "destructive" });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Please upload a file smaller than 5MB", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const file = selectedFile || fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ title: "No resume selected", description: "Please select a resume file first", variant: "destructive" });
      return;
    }
    if (!validateFile(file)) return;
    if (!jobDescription.trim()) {
      toast({ title: "Missing job description", description: "Paste a job description to evaluate ATS fit.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await submitResumeForAts(file, jobDescription);
      if (!data?.success || !data?.result) throw new Error(data?.message || "Unexpected response format");
      setAtsResult(data.result);
      setShowResults(true);
      
      // Update parent stats
      onJobsUpdated?.([]);
      onScoreUpdated?.(data.result.match_score);
      
      toast({ title: "ATS Evaluation Complete!", description: `Match score: ${data.result.match_score}/100` });
      setTimeout(() => document.getElementById("ats-results")?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setShowResults(false);
    setAtsResult(null);
    onJobsUpdated?.([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) {
      setSelectedFile(f);
      setShowResults(false);
      setAtsResult(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">ATS Match Evaluation</CardTitle>
                <p className="text-gray-600 text-sm">Gemini-powered resume vs job description analysis</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                {selectedFile ? "Change Resume" : "Upload Resume"}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => navigate("/skill-gap-analysis")} disabled={isSubmitting}>
                Skill Gap Page <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isSubmitting && (
          <CardContent className="pt-0">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Evaluating ATS match...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-[90%]" />
              </div>
            </div>
          </CardContent>
        )}

        {selectedFile && !isSubmitting && (
          <CardContent className="pt-0">
            <form onSubmit={handleFormSubmit}>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-white rounded-lg border border-blue-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{selectedFile.name}</p>
                      <p className="text-sm text-blue-600">Ready to evaluate ATS fit</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="h-8 w-8 p-0 hover:bg-blue-100">
                    <X className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[140px]"
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">Ready for ATS Evaluation?</h3>
                        <p className="text-blue-100 text-sm">Get a strict JSON score + strengths + missing skills</p>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Evaluating...</>
                      ) : (
                        <><Zap className="h-5 w-5 mr-2" /> Run ATS Evaluation</>
                      )}
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-blue-100 text-sm">
                      <span className="flex items-center justify-center gap-2"><Target className="h-4 w-4" /> Semantic Evaluation</span>
                      <span className="flex items-center justify-center gap-2"><Eye className="h-4 w-4" /> Strict JSON Output</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </form>
          </CardContent>
        )}
      </Card>

      {!selectedFile && !showResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-blue-700 font-medium">Upload your resume and paste a job description to get an ATS match score.</p>
              <p className="text-blue-600 text-sm">This replaces the old job recommendation feature.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showResults && !isSubmitting && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-full"><Sparkles className="h-6 w-6 text-green-600" /></div>
            <h3 className="text-lg font-semibold text-green-800">AI Analysis Complete!</h3>
          </div>
          <p className="text-green-700 mb-4">Your ATS match score is ready.</p>
          <div className="flex items-center justify-center gap-4 text-sm text-green-600">
            <span className="flex items-center gap-1"><Target className="h-4 w-4" /> Skill Match</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Strengths</span>
            <span className="flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Missing Skills</span>
          </div>
        </motion.div>
      )}

      {showResults && atsResult && (
        <motion.div id="ats-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Match score</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">{atsResult.match_score}/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confidence</span>
                  <Badge variant="outline">{atsResult.confidence}/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience match</span>
                  <Badge variant="outline">{atsResult.experience_match}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project relevance</span>
                  <Badge variant="outline">{atsResult.project_relevance}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{atsResult.summary || "—"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" /> Matching Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(atsResult.matching_skills || []).length ? (
                  atsResult.matching_skills.map((s) => (
                    <Badge key={s} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No matching skills detected.</span>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" /> Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(atsResult.missing_skills || []).length ? (
                  atsResult.missing_skills.map((s) => (
                    <Badge key={s} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No missing skills detected.</span>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(atsResult.strengths || []).length ? (
                  (atsResult.strengths || []).map((x, i) => <div key={i} className="text-sm text-gray-700">- {x}</div>)
                ) : (
                  <span className="text-sm text-gray-500">—</span>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Weaknesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(atsResult.weaknesses || []).length ? (
                  (atsResult.weaknesses || []).map((x, i) => <div key={i} className="text-sm text-gray-700">- {x}</div>)
                ) : (
                  <span className="text-sm text-gray-500">—</span>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(atsResult.improvement_suggestions || []).length ? (
                (atsResult.improvement_suggestions || []).map((x, i) => <div key={i} className="text-sm text-gray-700">- {x}</div>)
              ) : (
                <span className="text-sm text-gray-500">—</span>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
