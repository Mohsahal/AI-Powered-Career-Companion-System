import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/MockInterview/Custom-bread-crumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { QuestionSection } from "@/components/MockInterview/Question-form";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/config/api";
import { toast } from "sonner";
export const MockInterviewPage = () => {
    const { interviewId } = useParams();
    const [interview, setInterview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoading(true);
        const fetchInterview = async () => {
            if (interviewId) {
                try {
                    const token = getToken();
                    if (!token) {
                        toast.error("Authentication token not found");
                        return;
                    }
                    const result = await ApiClient.getInterviewById(interviewId, token);
                    if (result.success && result.data) {
                        setInterview(result.data);
                    }
                    else {
                        throw new Error("Failed to fetch interview");
                    }
                }
                catch (error) {
                    console.error("Error fetching interview:", error);
                    navigate("/generate");
                }
                finally {
                    setIsLoading(false);
                }
            }
        };
        fetchInterview();
    }, [interviewId, navigate, getToken]);
    if (isLoading) {
        return <LoaderPage className="w-full h-[70vh]"/>;
    }
    if (!interviewId || !interview) {
        return <LoaderPage className="w-full h-[70vh]"/>;
    }
    return (<div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <CustomBreadCrumb breadCrumbPage="Start" breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
                label: interview?.position || "",
                link: `/generate/interview/${interview?.id}`,
            },
        ]}/>
        </div>

        {/* Important Note Alert */}
        <div className="mb-8">
          <Alert className="bg-sky-50 border border-sky-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <Lightbulb className="h-5 w-5 text-sky-600 mt-1"/>
              <div>
                <AlertTitle className="text-sky-800 font-semibold text-lg">
                  Important Note
                </AlertTitle>
                <AlertDescription className="text-sky-700 mt-2 leading-relaxed">
                  Press "Record Answer" to begin answering the question. Once you
                  finish the interview, you'll receive feedback comparing your
                  responses with the ideal answers.
                  <br />
                  <br />
                  <strong>Note:</strong>{" "}
                  <span className="font-medium">Your video is never recorded.</span>{" "}
                  You can disable the webcam anytime if preferred.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>

        {/* Question Section */}
        {interview?.questions && interview?.questions.length > 0 && (<div className="w-full">
            <QuestionSection questions={interview?.questions} interviewId={interviewId}/>
          </div>)}

        {/* No Questions Message */}
        {(!interview?.questions || interview?.questions.length === 0) && (<div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No questions available for this interview.
            </p>
          </div>)}
      </div>
    </div>);
};
export default MockInterviewPage;
