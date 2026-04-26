import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardFooter, CardTitle, CardContent, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Calendar, Clock, Play } from "lucide-react";
export const InterviewPin = ({ interview, onMockPage = false, isCompletedOverride, }) => {
    const navigate = useNavigate();
    // Calculate interview stats
    const questionCount = interview?.questions?.length || 0;
    const isCompleted = typeof isCompletedOverride === 'boolean' ? isCompletedOverride : (questionCount > 0);
    const experienceLevel = interview?.experience || 0;
    // Get experience color
    const getExperienceColor = (exp) => {
        if (exp <= 2)
            return "bg-green-100 text-green-700 border-green-200";
        if (exp <= 5)
            return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-red-100 text-red-700 border-red-200";
    };
    // Get experience label
    const getExperienceLabel = (exp) => {
        if (exp <= 2)
            return "Junior Level";
        if (exp <= 5)
            return "Mid-Level Level";
        return "Senior Level";
    };
    return (<Card className="group bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
      <CardContent className="p-6">
        {/* Position Title and Status */}
        <div className="flex items-start justify-between mb-4">
          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-career-blue transition-colors duration-200">
            {interview?.position}
          </CardTitle>
          <Badge className={cn("px-2 py-1 text-xs font-medium", isCompleted
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-blue-100 text-blue-700 border-blue-200")}>
            {isCompleted ? "Completed" : "Ready"}
          </Badge>
        </div>

        {/* Description */}
        <CardDescription className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
          {interview?.description}
        </CardDescription>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {interview?.techStack.split(",").map((tech, index) => (<Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                {tech.trim()}
              </Badge>))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400"/>
            <span>{experienceLevel} years</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400"/>
            <span>{questionCount} questions</span>
          </div>
        </div>

        {/* Experience Level Badge */}
        <div className="mb-4">
          <Badge className={cn("px-3 py-1 text-xs font-medium border", getExperienceColor(experienceLevel))}>
            {getExperienceLabel(experienceLevel)}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full flex items-center justify-between">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3"/>
            <span>
              {(() => {
            if (!interview?.createdAt)
                return "Date not available";
            try {
                const createdAtDate = new Date(interview.createdAt);
                if (isNaN(createdAtDate.getTime()))
                    return "Invalid date";
                return createdAtDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
            }
            catch (error) {
                return "Date not available";
            }
        })()}
            </span>
          </div>

          {/* Action Buttons */}
          {!onMockPage && (<div className="flex items-center gap-2">
              <TooltipButton content="View Details" buttonVariant="ghost" onClick={() => navigate(`/generate/${interview?.id}`)} disabled={false} buttonClassName="h-8 w-8 p-0 hover:bg-blue-50 hover:text-career-blue transition-all duration-200" icon={<Eye className="h-4 w-4"/>} loading={false}/>

              <TooltipButton content="View Feedback" buttonVariant="ghost" onClick={() => navigate(`/generate/feedback/${interview?.id}`)} disabled={false} buttonClassName="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200" icon={<Newspaper className="h-4 w-4"/>} loading={false}/>

              <TooltipButton content="Start Interview" buttonVariant="ghost" onClick={() => navigate(`/generate/interview/${interview?.id}`)} disabled={false} buttonClassName="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200" icon={<Play className="h-4 w-4"/>} loading={false}/>
            </div>)}
        </div>
      </CardFooter>
    </Card>);
};
