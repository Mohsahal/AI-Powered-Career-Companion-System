import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/MockInterview/Custom-bread-crumb";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, WebcamIcon, Camera, CameraOff } from "lucide-react";
import { InterviewPin } from "@/components/MockInterview/pin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WebCam from "react-webcam";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/config/api";
import { toast } from "sonner";
export const MockLoadPage = () => {
    const { interviewId } = useParams();
    const [interview, setInterview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
    const [webcamError, setWebcamError] = useState(null);
    const webcamRef = useRef(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();
    // Webcam constraints
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };
    // Handle webcam success
    const handleUserMedia = useCallback(() => {
        setIsWebCamEnabled(true);
        setWebcamError(null);
    }, []);
    // Handle webcam error
    const handleUserMediaError = useCallback((error) => {
        console.error("Webcam error:", error);
        setIsWebCamEnabled(false);
        setWebcamError("Failed to access webcam. Please check permissions and try again.");
    }, []);
    // Toggle webcam
    const toggleWebcam = useCallback(() => {
        if (isWebCamEnabled) {
            setIsWebCamEnabled(false);
            setWebcamError(null);
        }
        else {
            setIsWebCamEnabled(true);
        }
    }, [isWebCamEnabled]);
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
                    const interviewPromise = ApiClient.getInterviewById(interviewId, token);
                    const answersPromise = ApiClient.getUserAnswersByInterview(interviewId, token);
                    const [interviewResult, answersResult] = await Promise.all([interviewPromise, answersPromise]);
                    if (interviewResult.success && interviewResult.data) {
                        setInterview(interviewResult.data);
                    }
                    else {
                        throw new Error("Failed to fetch interview");
                    }
                    if (answersResult.success && Array.isArray(answersResult.data)) {
                        setHasCompleted(answersResult.data.length > 0);
                    }
                    else {
                        setHasCompleted(false);
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
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        
        {/* Header Section with Start Button */}
        <div className="flex items-center justify-between w-full mb-8">
          <CustomBreadCrumb breadCrumbPage={interview?.position || ""} breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}/>
          
          <Link to={`/generate/interview/${interviewId}/start`}>
            <Button size="default" className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md shadow-sm">
              <Sparkles className="w-4 h-4 mr-2"/>
              Start
            </Button>
          </Link>
        </div>

        {/* Interview Card Section */}
        <div className="mb-8">
          {interview && (<InterviewPin interview={interview} onMockPage isCompletedOverride={hasCompleted}/>)}
        </div>

        {/* Important Information Alert */}
        <div className="mb-8">
          <Alert className="bg-yellow-50 border-yellow-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-yellow-600"/>
              </div>
              <div className="flex-1">
                <AlertTitle className="text-yellow-800 font-semibold text-base mb-2">
                  Important Information
                </AlertTitle>
                <AlertDescription className="text-yellow-700 text-sm leading-relaxed">
                  Please enable your webcam and microphone to start the AI-generated
                  mock interview. The interview consists of five questions. You'll
                  receive a personalized report based on your responses at the end.
                  <br /><br />
                  <span className="font-semibold">Note:</span> Your video is{" "}
                  <strong>never recorded</strong>. You can disable your webcam at any
                  time.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>

        {/* Webcam Preview Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center">
            {/* Webcam Container */}
            <div className="w-full max-w-2xl">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 overflow-hidden">
                {isWebCamEnabled ? (<div className="relative">
                    <WebCam ref={webcamRef} audio={false} videoConstraints={videoConstraints} onUserMedia={handleUserMedia} onUserMediaError={handleUserMediaError} className="w-full h-auto rounded-lg"/>
                  </div>) : (<div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <WebcamIcon className="w-24 h-24 text-gray-400"/>
                    <p className="text-gray-500 text-sm">Webcam Preview</p>
                    {webcamError && (<p className="text-red-500 text-xs text-center max-w-xs">
                        {webcamError}
                      </p>)}
                  </div>)}
              </div>
            </div>

            {/* Webcam Control Button */}
            <div className="mt-6">
              <Button onClick={toggleWebcam} variant="default" size="default" className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md">
                {isWebCamEnabled ? (<>
                    <CameraOff className="w-4 h-4 mr-2"/>
                    Disable Webcam
                  </>) : (<>
                    <Camera className="w-4 h-4 mr-2"/>
                    Enable Webcam
                  </>)}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>);
};
export default MockLoadPage;
