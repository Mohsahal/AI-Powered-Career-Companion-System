import { useState, useEffect, useCallback } from 'react';
export const useSpeechToText = (options = {}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [results, setResults] = useState([]);
    const [interimResult, setInterimResult] = useState(null);
    const [recognition, setRecognition] = useState(null);
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = options.continuous || false;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';
            recognitionInstance.onstart = () => {
                setIsRecording(true);
                setInterimResult(null);
            };
            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    const confidence = event.results[i][0].confidence || 1;
                    if (event.results[i].isFinal) {
                        // Only add final results to avoid duplicates
                        console.log('Final transcript:', transcript);
                        setResults(prev => [...prev, { transcript: transcript.trim(), confidence }]);
                        setInterimResult(null); // Clear interim when final is received
                    }
                    else {
                        // Accumulate interim results for display
                        interimTranscript += transcript;
                    }
                }
                // Only update interim if there's actually interim text
                if (interimTranscript) {
                    setInterimResult(interimTranscript.trim());
                }
            };
            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
                // Provide specific error messages
                switch (event.error) {
                    case 'no-speech':
                        console.warn('No speech detected. Please try speaking again.');
                        break;
                    case 'audio-capture':
                        console.error('No microphone found. Please connect a microphone.');
                        break;
                    case 'not-allowed':
                        console.error('Microphone permission denied. Please allow microphone access.');
                        break;
                    case 'network':
                        console.error('Network error. Please check your internet connection.');
                        break;
                    default:
                        console.error('Speech recognition error:', event.error);
                }
            };
            recognitionInstance.onend = () => {
                setIsRecording(false);
            };
            setRecognition(recognitionInstance);
        }
    }, [options.continuous]);
    const startSpeechToText = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
                console.log('Speech recognition started');
            }
            catch (error) {
                console.error('Error starting speech recognition:', error);
                // Recognition might already be running, which is okay
            }
        }
        else {
            console.error('Speech recognition not supported in this browser');
        }
    }, [recognition]);
    const stopSpeechToText = useCallback(() => {
        if (recognition) {
            try {
                recognition.stop();
                console.log('Speech recognition stopped');
            }
            catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    }, [recognition]);
    const resetTranscript = useCallback(() => {
        setResults([]);
        setInterimResult(null);
    }, []);
    return {
        isRecording,
        results,
        interimResult,
        startSpeechToText,
        stopSpeechToText,
        resetTranscript,
    };
};
export default useSpeechToText;
