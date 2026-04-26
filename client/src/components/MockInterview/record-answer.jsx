/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/contexts/AuthContext";
import { CircleStop, Loader, Mic, RefreshCw, Save, Video, VideoOff, WebcamIcon, Volume2, VolumeX, } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import useSpeechToText from "@/hooks/useSpeechToText";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { SaveModal } from "./save-modal";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { ApiClient } from "@/config/api";
export const RecordAnswer = ({ question, isWebCam, setIsWebCam, interviewId, onQuestionComplete, currentQuestionIndex = 0, totalQuestions = 1, }) => {
    const { interimResult, isRecording, results, startSpeechToText, stopSpeechToText, resetTranscript, } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });
    const [userAnswer, setUserAnswer] = useState("");
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true); // Track speaker state
    const [isCameraOn, setIsCameraOn] = useState(true); // Track camera state
    const [inputMode, setInputMode] = useState('speech'); // Track input mode
    const webcamRef = useRef(null);
    const { user, getToken } = useAuth();
    // Auto-start camera when component mounts
    useEffect(() => {
        setIsCameraOn(true);
        setIsWebCam(true);
    }, []);
    // Auto-read question when component mounts or question changes
    useEffect(() => {
        if (question.question && isSpeakerOn) {
            speakQuestion(question.question);
        }
    }, [question.question, isSpeakerOn]);
    // Function to speak the question
    const speakQuestion = (text) => {
        if ('speechSynthesis' in window && isSpeakerOn) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for better comprehension
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    };
    // Toggle speaker on/off
    const toggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn);
        if (isSpeakerOn) {
            speechSynthesis.cancel(); // Stop current speech
        }
        else {
            speakQuestion(question.question); // Start speaking when turned on
        }
    };
    // Toggle camera on/off
    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
        setIsWebCam(!isCameraOn);
    };
    const recordUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer?.length < 30) {
                toast.error("Error", {
                    description: "Your answer should be more than 30 characters",
                });
                return;
            }
            // Generate AI result
            const aiResult = await generateResult(question.question, question.answer, userAnswer);
            setAiResult(aiResult);
        }
        else {
            startSpeechToText();
        }
    };
    const cleanJsonResponse = (responseText) => {
        // Step 1: Trim any surrounding whitespace
        let cleanText = responseText.trim();
        // Step 2: Remove markdown code blocks (```json ... ``` or ``` ... ```)
        cleanText = cleanText.replace(/```(?:json)?\s*/g, "").replace(/```\s*$/g, "");
        // Step 3: Try to extract JSON object between curly braces
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }
        // Step 4: Fix common JSON issues with control characters
        try {
            // First attempt: try parsing as-is
            const parsed = JSON.parse(cleanText);
            // Validate that we have the expected structure
            if (!parsed || typeof parsed !== 'object') {
                throw new Error("Response is not a valid object");
            }
            return parsed;
        }
        catch (error) {
            // Step 5: If parsing fails, try to fix control characters
            console.warn("Initial JSON parse failed, attempting to fix control characters...");
            try {
                // More robust approach: Find the feedback value and fix it properly
                // Match from "feedback": " to the closing " before the next field or end
                let fixedJson = cleanText.replace(/"feedback"\s*:\s*"([\s\S]*?)"\s*(?=[,}])/, (match, content) => {
                    // Escape all control characters in the feedback content
                    const escaped = content
                        .replace(/\\/g, '\\\\') // Escape backslashes first
                        .replace(/"/g, '\\"') // Escape quotes
                        .replace(/\n/g, '\\n') // Escape newlines
                        .replace(/\r/g, '\\r') // Escape carriage returns
                        .replace(/\t/g, '\\t') // Escape tabs
                        .replace(/\f/g, '\\f') // Escape form feeds
                        .replace(/\b/g, '\\b'); // Escape backspaces
                    return `"feedback": "${escaped}"`;
                });
                const parsed = JSON.parse(fixedJson);
                console.log("Successfully parsed after fixing control characters");
                // Validate structure
                if (!parsed || typeof parsed !== 'object') {
                    throw new Error("Response is not a valid object");
                }
                return parsed;
            }
            catch (secondError) {
                console.error("JSON parsing error (after fixes):", secondError);
                console.error("Attempted to parse:", cleanText);
                throw new Error("Invalid JSON format: " + error?.message);
            }
        }
    };
    const generateResult = async (qst, qstAns, userAns) => {
        setIsAiGenerating(true);
        const prompt = `You are an expert technical interviewer evaluating candidate responses.

Question: "${qst}"

Correct/Expected Answer: "${qstAns}"

Candidate's Answer: "${userAns}"

Compare the candidate's answer to the expected answer and provide:
1. A rating from 1 to 10 (where 1 is completely wrong and 10 is perfect)
2. Constructive feedback for improvement

IMPORTANT: Return ONLY a valid JSON object in this EXACT format, with no additional text, explanations, or markdown:
{
  "ratings": <number between 1-10>,
  "feedback": "<detailed constructive feedback string>"
}

Do not include any text before or after the JSON object. Do not use markdown code blocks or backticks.`;
        try {
            let aiResult;
            try {
                aiResult = await chatSession.sendMessage(prompt);
            }
            catch (chatError) {
                console.error('ChatSession error:', chatError);
                throw new Error(`AI service error: ${chatError instanceof Error ? chatError.message : 'Unknown error'}`);
            }
            const responseText = aiResult.response.text();
            console.log('AI Response (raw):', responseText);
            // Check if response is an error message or empty
            if (!responseText || responseText.trim() === '') {
                throw new Error('AI service returned an empty response');
            }
            if (responseText.includes('error') || responseText.includes('Sorry') || responseText.includes('No response')) {
                throw new Error(`AI service error: ${responseText}`);
            }
            try {
                const parsedResult = cleanJsonResponse(responseText);
                console.log('Parsed AI result:', parsedResult);
                // Validate the parsed result structure and types
                if (!parsedResult || typeof parsedResult !== 'object') {
                    throw new Error('Response is not an object');
                }
                if (typeof parsedResult.ratings !== 'number' || parsedResult.ratings < 1 || parsedResult.ratings > 10) {
                    console.warn('Invalid ratings value:', parsedResult.ratings);
                    parsedResult.ratings = 5; // Default to middle rating
                }
                if (typeof parsedResult.feedback !== 'string' || parsedResult.feedback.trim() === '') {
                    throw new Error('Invalid or empty feedback string');
                }
                toast.success("Feedback Generated", {
                    description: "Your answer has been evaluated successfully."
                });
                return parsedResult;
            }
            catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                console.error('Raw response was:', responseText);
                toast.error("Parsing Error", {
                    description: "Unable to parse AI feedback. Check console for details."
                });
                // Return a default response if parsing fails
                return {
                    ratings: 5,
                    feedback: 'Unable to generate structured feedback. Please try recording your answer again.'
                };
            }
        }
        catch (error) {
            console.error('Error generating feedback:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Show more specific error messages
            if (errorMessage.includes('API Error 500')) {
                toast.error("Server Error", {
                    description: "The AI service is having issues. Please check if the GEMINI_API_KEY is configured correctly.",
                });
            }
            else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
                toast.error("Network Error", {
                    description: "Unable to connect to the AI service. Please check your internet connection and server status.",
                });
            }
            else if (errorMessage.includes('AI service error')) {
                toast.error("AI Service Error", {
                    description: errorMessage,
                });
            }
            else {
                toast.error("Error", {
                    description: `Failed to generate feedback: ${errorMessage}`,
                });
            }
            return {
                ratings: 0,
                feedback: `Unable to generate feedback. Error: ${errorMessage}`
            };
        }
        finally {
            setIsAiGenerating(false);
        }
    };
    const recordNewAnswer = () => {
        setUserAnswer("");
        setAiResult(null);
        if (inputMode === 'speech') {
            stopSpeechToText();
            // Reset transcript to clear previous results
            resetTranscript();
            setTimeout(() => {
                startSpeechToText();
            }, 300); // Small delay to ensure clean start
        }
    };
    // Submit text answer for evaluation
    const submitTextAnswer = async () => {
        if (userAnswer?.length < 30) {
            toast.error("Error", {
                description: "Your answer should be more than 30 characters",
            });
            return;
        }
        // Generate AI result
        const aiResult = await generateResult(question.question, question.answer, userAnswer);
        setAiResult(aiResult);
    };
    const saveUserAnswer = async () => {
        setLoading(true);
        if (!aiResult || !user) {
            return;
        }
        const currentQuestion = question.question;
        try {
            const token = getToken();
            if (!token) {
                toast.error("Authentication token not found");
                return;
            }
            // Check if user already answered this question
            const existingAnswers = await ApiClient.getUserAnswersByInterview(interviewId, token);
            const alreadyAnswered = existingAnswers.data?.some((answer) => answer.question === currentQuestion);
            if (alreadyAnswered) {
                toast.info("Already Answered", {
                    description: "You have already answered this question",
                });
                return;
            }
            // Save the user answer
            const saveData = {
                mockIdRef: interviewId,
                question: question.question,
                correct_ans: question.answer,
                user_ans: userAnswer,
                feedback: aiResult.feedback,
                rating: aiResult.ratings,
                userId: user.id,
            };
            console.log('Saving user answer data:', saveData);
            const result = await ApiClient.saveUserAnswer(saveData, token);
            if (result.success) {
                toast("Saved", { description: "Your answer has been saved successfully!" });
                // Reset state
                setUserAnswer("");
                setAiResult(null);
                stopSpeechToText();
                // Auto-advance to next question if callback exists
                if (onQuestionComplete) {
                    setTimeout(() => {
                        onQuestionComplete();
                    }, 1500); // Wait 1.5 seconds before moving to next question
                }
            }
            else {
                throw new Error(result.message || "Failed to save answer");
            }
        }
        catch (error) {
            toast("Error", {
                description: "An error occurred while saving your answer.",
            });
            console.log(error);
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    };
    useEffect(() => {
        // Only update from speech results if in speech mode
        if (inputMode === 'speech') {
            const combineTranscripts = results
                .filter((result) => typeof result !== "string")
                .map((result) => result.transcript)
                .join(" ")
                .trim();
            setUserAnswer(combineTranscripts);
            console.log('User answer updated:', combineTranscripts);
        }
    }, [results, inputMode]);
    return (<div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}
      <SaveModal isOpen={open} onClose={() => setOpen(false)} onConfirm={saveUserAnswer} loading={loading}/>

      {/* Question Progress */}
      <div className="w-full max-w-2xl text-center">
        <div className="text-sm text-gray-600 mb-2">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
        </div>
      </div>

      {/* Input Mode Toggle - Segmented Control */}
      <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-lg">
        <button onClick={() => {
            setInputMode('speech');
            setUserAnswer('');
            setAiResult(null);
        }} className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${inputMode === 'speech'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'}`}>
          <Mic className="w-4 h-4"/>
          Voice
        </button>
        <button onClick={() => {
            setInputMode('text');
            stopSpeechToText();
            setUserAnswer('');
            setAiResult(null);
        }} className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${inputMode === 'text'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'}`}>
          <span className="text-base">✏️</span>
          Text
        </button>
      </div>

      {/* Camera Section */}
      <div className="w-1/2 h-[200px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam && isCameraOn ? (<WebCam ref={webcamRef} onUserMedia={() => setIsWebCam(true)} onUserMediaError={() => {
                setIsWebCam(false);
                setIsCameraOn(false);
                toast.error("Camera Error", {
                    description: "Unable to access camera. Please check permissions.",
                });
            }} className="w-full h-full object-cover rounded-md" screenshotFormat="image/jpeg" videoConstraints={{
                width: 400,
                height: 300,
                facingMode: "user"
            }}/>) : (<div className="flex flex-col items-center justify-center text-center">
            <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground mb-2"/>
            <p className="text-sm text-gray-500">
              {isCameraOn ? "Camera is starting..." : "Camera is off"}
            </p>
          </div>)}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <TooltipButton content={isCameraOn ? "Turn Camera Off" : "Turn Camera On"} icon={isCameraOn ? (<Video className="min-w-5 min-h-5"/>) : (<VideoOff className="min-w-5 min-h-5"/>)} onClick={toggleCamera} buttonClassName={isCameraOn ? "bg-green-100 hover:bg-green-200 text-green-700" : "bg-red-100 hover:bg-red-200 text-red-700"}/>

        <TooltipButton content={isSpeakerOn ? "Turn Speaker Off" : "Turn Speaker On"} icon={isSpeakerOn ? (<Volume2 className="min-w-5 min-h-5"/>) : (<VolumeX className="min-w-5 min-h-5"/>)} onClick={toggleSpeaker} buttonClassName={isSpeakerOn ? "bg-blue-100 hover:bg-blue-200 text-blue-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}/>

        {/* Speech Mode Controls */}
        {inputMode === 'speech' && (<>
            <TooltipButton content={isRecording ? "Stop Recording" : "Start Recording"} icon={isRecording ? (<CircleStop className="min-w-5 min-h-5"/>) : (<Mic className="min-w-5 min-h-5"/>)} onClick={recordUserAnswer} buttonClassName={isRecording ? "bg-red-100 hover:bg-red-200 text-red-700" : "bg-blue-100 hover:bg-blue-200 text-blue-700"}/>

            <TooltipButton content="Record Again" icon={<RefreshCw className="min-w-5 min-h-5"/>} onClick={recordNewAnswer} buttonClassName="bg-gray-100 hover:bg-gray-200 text-gray-700"/>
          </>)}

        {/* Text Mode Controls */}
        {inputMode === 'text' && (<TooltipButton content="Submit Answer for Evaluation" icon={<CircleStop className="min-w-5 min-h-5"/>} onClick={submitTextAnswer} disabled={userAnswer.length < 30 || isAiGenerating} buttonClassName="bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"/>)}

        <TooltipButton content="Save Result" icon={isAiGenerating ? (<Loader className="min-w-5 min-h-5 animate-spin"/>) : (<Save className="min-w-5 min-h-5"/>)} onClick={() => setOpen(true)} disabled={!aiResult || isAiGenerating} buttonClassName="bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"/>
      </div>

      {/* Answer Display */}
      <div className="w-full max-w-4xl mt-4 p-6 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Answer:</h2>
          {inputMode === 'speech' && isRecording && (<div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-medium">Recording...</span>
            </div>)}
          {inputMode === 'text' && (<span className="text-sm text-gray-600">
              {userAnswer.length} characters (min: 30)
            </span>)}
        </div>
        
        {/* Text Input Mode */}
        {inputMode === 'text' ? (<textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Type your answer here... (minimum 30 characters)" className="w-full min-h-[200px] p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" disabled={isAiGenerating}/>) : (
        /* Speech Input Mode - Read Only */
        <div className="bg-white p-4 rounded-md border min-h-[200px]">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {userAnswer || "Click 'Start Recording' to begin speaking your answer..."}
            </p>
          </div>)}

        {/* Interim Speech Results */}
        {inputMode === 'speech' && interimResult && (<div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
            <p className="text-sm text-blue-700">
              <strong>Currently speaking:</strong> {interimResult}
            </p>
          </div>)}

        {/* AI Generating Feedback Loading State */}
        {isAiGenerating && (<div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Loader className="w-5 h-5 animate-spin text-purple-600"/>
              <div>
                <h3 className="text-md font-semibold text-gray-800">Generating Feedback...</h3>
                <p className="text-sm text-gray-600">AI is evaluating your answer. Please wait...</p>
              </div>
            </div>
          </div>)}

        {/* AI Feedback Display */}
        {aiResult && !isAiGenerating && (<div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-800">AI Feedback</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rating:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {aiResult.ratings}/10
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{aiResult.feedback}</p>
          </div>)}
      </div>
    </div>);
};
