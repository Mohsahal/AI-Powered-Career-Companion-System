import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Brain, Mic, Target } from "lucide-react";
export const LoaderPage = ({ className, message = "Loading your interview...", showIcon = true, }) => {
    return (<div className={cn("flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-white", className)}>
      {/* Main Loading Container */}
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Animated Icon */}
        {showIcon && (<div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white"/>
            </div>
            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"/>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}/>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}/>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}/>
              </div>
            </div>
          </div>)}

        {/* Loading Spinner */}
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin"/>
          <span className="text-lg font-medium text-gray-700">{message}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"/>
        </div>

        {/* Feature Icons */}
        <div className="flex items-center space-x-6 mt-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mic className="w-5 h-5 text-blue-600"/>
            </div>
            <span className="text-xs text-gray-500">Voice Analysis</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600"/>
            </div>
            <span className="text-xs text-gray-500">AI Questions</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600"/>
            </div>
            <span className="text-xs text-gray-500">Smart Feedback</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"/>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}/>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
        </div>

        {/* Subtle Text */}
        <p className="text-sm text-gray-400 text-center max-w-md mt-4">
          Preparing your personalized interview experience...
        </p>
      </div>
    </div>);
};
// Alternative minimal loader for smaller spaces
export const MinimalLoader = ({ className }) => {
    return (<div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin"/>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>);
};
// Skeleton loader for content
export const SkeletonLoader = ({ className }) => {
    return (<div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
      <div className="h-4 bg-gray-200 rounded w-5/6"/>
    </div>);
};
