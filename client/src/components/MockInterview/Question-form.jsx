import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./record-answer";
import { toast } from "sonner";
export const QuestionSection = ({ questions, interviewId }) => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWebCam, setIsWebCam] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentSpeech, setCurrentSpeech] = useState(null);
    // Auto-advance to next question
    const handleQuestionComplete = () => {
        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            // Auto-read the next question
            setTimeout(() => {
                handlePlayQuestion(questions[nextIndex].question);
            }, 500);
        }
        else {
            // All questions completed - redirect to feedback page
            toast.success("Interview Completed!", {
                description: "Redirecting to feedback page...",
            });
            setTimeout(() => {
                navigate(`/generate/feedback/${interviewId}`);
            }, 1500); // Wait 1.5 seconds before redirecting
        }
    };
    const handlePlayQuestion = (qst) => {
        if (isPlaying && currentSpeech) {
            // stop the speech if already playing
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentSpeech(null);
        }
        else {
            if ("speechSynthesis" in window) {
                const speech = new SpeechSynthesisUtterance(qst);
                speech.rate = 0.9; // Slightly slower for better comprehension
                speech.pitch = 1;
                speech.volume = 0.8;
                window.speechSynthesis.speak(speech);
                setIsPlaying(true);
                setCurrentSpeech(speech);
                // handle the speech end
                speech.onend = () => {
                    setIsPlaying(false);
                    setCurrentSpeech(null);
                };
            }
        }
    };
    // Auto-read first question when component mounts
    useEffect(() => {
        if (questions.length > 0) {
            setTimeout(() => {
                handlePlayQuestion(questions[0].question);
            }, 1000); // Wait 1 second for component to fully load
        }
    }, []);
    // Update current question index when tab changes
    const handleTabChange = (value) => {
        const index = questions.findIndex(q => q.question === value);
        if (index !== -1) {
            setCurrentQuestionIndex(index);
        }
    };
    return (<div className="w-full min-h-96 border rounded-md p-4">
      {/* Interview Progress Header */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Interview Progress
        </h3>
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-sm text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <Tabs value={questions[currentQuestionIndex]?.question} onValueChange={handleTabChange} className="w-full space-y-12" orientation="vertical">
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
          {questions?.map((tab, i) => (<TabsTrigger className={cn("data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-3 py-2 transition-all duration-200", i === currentQuestionIndex ? "ring-2 ring-emerald-300" : "")} key={tab.question} value={tab.question} disabled={i > currentQuestionIndex} // Disable future questions
        >
              {`Question #${i + 1}`}
              {i < currentQuestionIndex && (<span className="ml-2 text-emerald-600">✓</span>)}
            </TabsTrigger>))}
        </TabsList>

        {questions?.map((tab, i) => (<TabsContent key={i} value={tab.question}>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Question {i + 1}
              </h4>
              <p className="text-base text-left tracking-wide text-gray-700 leading-relaxed">
                {tab.question}
              </p>

              <div className="w-full flex items-center justify-end mt-4">
                <TooltipButton content={isPlaying ? "Speaker On - Click to Turn Off" : "Speaker Off - Click to Turn On"} icon={isPlaying ? (<Volume2 className="min-w-5 min-h-5 text-blue-600"/>) : (<VolumeX className="min-w-5 min-h-5 text-red-600"/>)} onClick={() => handlePlayQuestion(tab.question)} buttonClassName={isPlaying ? "bg-blue-100 hover:bg-blue-200 text-blue-700" : "bg-red-100 hover:bg-red-200 text-red-700"}/>
              </div>
            </div>

            <RecordAnswer question={tab} isWebCam={isWebCam} setIsWebCam={setIsWebCam} interviewId={interviewId} onQuestionComplete={handleQuestionComplete} currentQuestionIndex={i} totalQuestions={questions.length}/>
          </TabsContent>))}
      </Tabs>
    </div>);
};
