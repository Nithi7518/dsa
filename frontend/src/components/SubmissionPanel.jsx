import React from 'react';
import { AlertCircle, CheckCircle2, Bot } from 'lucide-react';

const SubmissionPanel = ({ submissionResult }) => {
  if (!submissionResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
        <Bot className="w-12 h-12 mb-3 text-gray-300" />
        <p>Run your code to get AI-powered diagnostic feedback.</p>
      </div>
    );
  }

  const isCorrect = submissionResult.isCorrect;

  return (
    <div className="h-full flex flex-col animate-in fade-in">
      <div className={`p-4 border-b flex items-center gap-2 font-medium ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
        {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        {isCorrect ? 'Accepted!' : 'Wrong Answer'}
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        {!isCorrect && submissionResult.aiExplanation && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              AI Diagnostic Feedback
            </h3>
            <div className="prose prose-sm prose-blue text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100 leading-relaxed whitespace-pre-wrap">
              {submissionResult.aiExplanation}
            </div>
          </div>
        )}
        
        {isCorrect && (
          <div className="text-center py-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Great job!</h3>
            <p className="text-gray-600">Your solution passed all test cases.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPanel;
