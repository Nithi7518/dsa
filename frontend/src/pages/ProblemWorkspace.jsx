import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TutorChatPanel from '../components/TutorChatPanel';
import SubmissionPanel from '../components/SubmissionPanel';
import { getProblem, submitCode } from '../api/apiClient';
import { Play, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

const LANGUAGE_BOILERPLATES = {
  javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solve = function(nums, target) {\n    \n};',
  python: 'class Solution:\n    def solve(self, nums: List[int], target: int) -> List[int]:\n        pass',
  java: 'class Solution {\n    public int[] solve(int[] nums, int target) {\n        \n    }\n}',
  c: '/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* solve(int* nums, int numsSize, int target, int* returnSize) {\n    \n}',
  cpp: 'class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        \n    }\n};'
};

const ProblemWorkspace = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_BOILERPLATES['javascript']);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Update boilerplate when language changes
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(LANGUAGE_BOILERPLATES[newLang] || '');
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(id);
        setProblem(data);
      } catch (err) {
        console.log("Mocking problem data", err);
        setProblem({
          id,
          title: 'Two Sum',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
          difficulty: 'EASY'
        });
      }
    };
    fetchProblem();
  }, [id]);

  const handleRunCode = async () => {
    setSubmitting(true);
    try {
      const result = await submitCode({
        problemId: id,
        code: code,
        language: selectedLanguage,
        isCorrect: false // Mocking an incorrect submission to demo the AI explanation
      });
      setSubmissionResult(result);
    } catch (err) {
      console.error("Submission failed", err);
      // Mock failure for demo
      setTimeout(() => {
        setSubmissionResult({
          isCorrect: false,
          aiExplanation: "1. What the code does: Your code currently does not implement a loop or mapping to find the pairs.\n\n2. Where it breaks: It will return undefined instead of an array of indices.\n\n3. Guiding question: How can you keep track of the numbers you've seen so far to quickly check if the complement (target - current) exists?"
        });
        setSubmitting(false);
      }, 1500);
      return;
    }
    setSubmitting(false);
  };

  if (!problem) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)]">
      {/* Left Column: Problem Description & Hints */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200 overflow-y-auto max-h-[50%]">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h2>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-4">
            {problem.difficulty}
          </span>
          <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
        
        <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
          <TutorChatPanel problemId={id} currentCode={code} selectedLanguage={selectedLanguage} />
        </div>
      </div>

      {/* Middle/Right Column: Editor & Console */}
      <div className="w-full lg:w-2/3 flex flex-col bg-gray-50">
        
        {/* Editor Area */}
        <div className="flex-1 flex flex-col border-b border-gray-200">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex justify-between items-center text-sm font-medium text-gray-600">
            <select 
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <button 
              onClick={handleRunCode}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run Code
            </button>
          </div>
          <div className="flex-1 w-full">
            <Editor
              height="100%"
              language={selectedLanguage === 'c' || selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                formatOnPaste: true,
                autoIndent: 'full',
              }}
            />
          </div>
        </div>

        {/* Results / Feedback Area */}
        <div className="h-64 bg-white overflow-hidden">
          <SubmissionPanel submissionResult={submissionResult} />
        </div>

      </div>
    </div>
  );
};

export default ProblemWorkspace;
