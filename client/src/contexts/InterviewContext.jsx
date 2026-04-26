import React, { createContext, useContext, useState } from 'react';
const InterviewContext = createContext(undefined);
export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }
    return context;
};
export const InterviewProvider = ({ children }) => {
    // Configuration
    const [interviewType, setInterviewType] = useState('technical');
    const [role, setRole] = useState('Frontend Developer');
    const [language, setLanguage] = useState('English');
    const [interviewMode, setInterviewMode] = useState('voice');
    // Status
    const [status, setStatus] = useState('setup');
    // Questions and responses
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState([]);
    // Feedback
    const [feedback, setFeedback] = useState([]);
    // Audio settings
    const [ambianceVolume, setAmbianceVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    // Timer
    const [duration, setDuration] = useState(0);
    const addResponse = (response) => {
        setResponses(prev => [...prev, response]);
    };
    const updateResponse = (questionId, data) => {
        setResponses(prev => prev.map(response => response.questionId === questionId ? { ...response, ...data } : response));
    };
    const addFeedback = (feedbackData) => {
        setFeedback(prev => [...prev, feedbackData]);
    };
    const resetInterview = () => {
        setStatus('setup');
        setCurrentQuestionIndex(0);
        setResponses([]);
        setFeedback([]);
        setDuration(0);
    };
    const value = {
        interviewType,
        setInterviewType,
        role,
        setRole,
        language,
        setLanguage,
        interviewMode,
        setInterviewMode,
        status,
        setStatus,
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        responses,
        addResponse,
        updateResponse,
        feedback,
        addFeedback,
        ambianceVolume,
        setAmbianceVolume,
        isMuted,
        setIsMuted,
        duration,
        setDuration,
        resetInterview
    };
    return (<InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>);
};
