import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "../MockInterview/loader-page";
import { CustomBreadCrumb } from "./Custom-bread-crumb";
import { Headings } from "./Headings";
import { InterviewPin } from "./pin";
import { ApiClient } from "@/config/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
export const Feedback = () => {
    const { interviewId } = useParams();
    const [interview, setInterview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [activeFeed, setActiveFeed] = useState("");
    const { user, getToken } = useAuth();
    const navigate = useNavigate();
    if (!interviewId) {
        navigate("/generate");
    }
    useEffect(() => {
        if (interviewId) {
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
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            };
            const fetchFeedbacks = async () => {
                setIsLoading(true);
                try {
                    const token = getToken();
                    if (!token) {
                        toast.error("Authentication token not found");
                        return;
                    }
                    const result = await ApiClient.getUserAnswersByInterview(interviewId, token);
                    console.log('Feedback API Response:', result);
                    if (result.success && result.data && Array.isArray(result.data)) {
                        console.log('Setting feedbacks:', result.data);
                        // Ensure each feedback item has the required fields
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const validatedFeedbacks = result.data.map((feedback) => ({
                            id: feedback.id || feedback._id || Math.random().toString(),
                            question: feedback.question || 'No question available',
                            correct_ans: feedback.correct_ans || 'No expected answer available',
                            user_ans: feedback.user_ans || 'No user answer available',
                            feedback: feedback.feedback || 'No feedback available',
                            rating: typeof feedback.rating === 'number' ? feedback.rating : 0,
                            userId: feedback.userId || '',
                            mockIdRef: feedback.mockIdRef || '',
                            createdAt: feedback.createdAt || new Date(),
                            updatedAt: feedback.updatedAt || new Date(),
                        }));
                        setFeedbacks(validatedFeedbacks);
                    }
                    else {
                        console.log('No feedback data received:', result);
                        setFeedbacks([]);
                    }
                }
                catch (error) {
                    console.log(error);
                    toast("Error", {
                        description: "Something went wrong. Please try again later..",
                    });
                }
                finally {
                    setIsLoading(false);
                }
            };
            fetchInterview();
            fetchFeedbacks();
        }
    }, [interviewId, navigate, user, getToken]);
    //   calculate the ratings out of 10
    const overAllRating = useMemo(() => {
        if (feedbacks.length === 0)
            return "0.0";
        const totalRatings = feedbacks.reduce((acc, feedback) => acc + (feedback.rating || 0), 0);
        return (totalRatings / feedbacks.length).toFixed(1);
    }, [feedbacks]);
    if (isLoading) {
        return <LoaderPage className="w-full h-[70vh]"/>;
    }
    return (<div className="flex flex-col w-full gap-8 py-8 px-4">
      <div className="flex items-center justify-between w-full gap-2">
        <CustomBreadCrumb breadCrumbPage={"Feedback"} breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
                label: `${interview?.position}`,
                link: `/generate/interview/${interview?.id}`,
            },
        ]}/>
      </div>

      <Headings title="Congratulations !" description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."/>

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} onMockPage/>}

      <Headings title="Interview Feedback" isSubHeading/>

      {feedbacks && feedbacks.length > 0 ? (<div className="w-full">
          <Accordion type="single" collapsible className="space-y-4 w-full">
            {feedbacks.map((feed) => {
                console.log('Rendering feedback item:', feed);
                return (<AccordionItem key={feed.id} value={feed.id} className="border rounded-md bg-white shadow-sm w-full">
                  <AccordionTrigger onClick={() => setActiveFeed(feed.id)} className={cn("px-5 py-3 text-left text-base rounded-t-md transition-colors hover:no-underline w-full", activeFeed === feed.id
                        ? "bg-gradient-to-r from-purple-50 to-blue-50"
                        : "hover:bg-gray-50")}>
                    <span className="text-left">{feed.question}</span>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 py-6 bg-white rounded-b-md space-y-5 w-full">
                    <div className="text-lg font-semibold text-gray-700">
                      <Star className="inline mr-2 text-yellow-400"/>
                      Rating: {feed.rating || 'N/A'}
                    </div>

                    <Card className="border-none space-y-3 p-4 bg-green-50 rounded-md shadow-sm w-full">
                      <CardTitle className="flex items-center text-lg">
                        <CircleCheck className="mr-2 text-green-600"/>
                        Expected Answer
                      </CardTitle>

                      <CardDescription className="font-medium text-gray-700">
                        {feed.correct_ans || 'No expected answer available'}
                      </CardDescription>
                    </Card>

                    <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-md shadow-sm w-full">
                      <CardTitle className="flex items-center text-lg">
                        <CircleCheck className="mr-2 text-yellow-600"/>
                        Your Answer
                      </CardTitle>

                      <CardDescription className="font-medium text-gray-700">
                        {feed.user_ans || 'No user answer available'}
                      </CardDescription>
                    </Card>

                    <Card className="border-none space-y-3 p-4 bg-red-50 rounded-md shadow-sm w-full">
                      <CardTitle className="flex items-center text-lg">
                        <CircleCheck className="mr-2 text-red-600"/>
                        Feedback
                      </CardTitle>

                      <CardDescription className="font-medium text-gray-700">
                        {feed.feedback || 'No feedback available'}
                      </CardDescription>
                    </Card>
                  </AccordionContent>
                </AccordionItem>);
            })}
          </Accordion>
        </div>) : (<div className="text-center py-8 w-full">
          <p className="text-gray-500 text-lg">No feedback available yet.</p>
          <p className="text-gray-400 text-sm mt-2">Complete the interview to see your feedback.</p>
        </div>)}
    </div>);
};
