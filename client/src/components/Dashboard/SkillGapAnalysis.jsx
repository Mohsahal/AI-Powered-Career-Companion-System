import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, BookOpen, Play, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function SkillGapAnalysis() {
    const navigate = useNavigate();
    const handleStartAnalysis = () => {
        navigate('/skill-gap-analysis');
    };
    return (<div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
          <p className="text-gray-500">Analyze your skills against job requirements</p>
        </div>
        <Button onClick={handleStartAnalysis} className="flex items-center gap-2">
          <Target className="h-4 w-4"/>
          Start Analysis
          <ArrowRight className="h-4 w-4"/>
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5"/>
            Skill Gap Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              Get a comprehensive analysis of your skills compared to job requirements. 
              Upload your resume and job description to identify skill gaps and get personalized learning recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-blue-600 mb-3">
                  <Target className="h-12 w-12 mx-auto"/>
                </div>
                <div className="font-semibold text-lg mb-2">Skill Assessment</div>
                <div className="text-sm text-gray-600">Analyze your current skills against job requirements</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 mb-3">
                  <BookOpen className="h-12 w-12 mx-auto"/>
                </div>
                <div className="font-semibold text-lg mb-2">Learning Paths</div>
                <div className="text-sm text-gray-600">Get personalized recommendations and resources</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-purple-600 mb-3">
                  <Play className="h-12 w-12 mx-auto"/>
                </div>
                <div className="font-semibold text-lg mb-2">Video Resources</div>
                <div className="text-sm text-gray-600">Curated tutorials and learning materials</div>
              </div>
            </div>

            <div className="text-center pt-6 border-t">
              <Button onClick={handleStartAnalysis} size="lg" className="px-8 py-3 text-lg">
                <Target className="h-5 w-5 mr-2"/>
                Start Skill Gap Analysis
                <ArrowRight className="h-5 w-5 ml-2"/>
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Click to open the full analysis tool
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);
}
