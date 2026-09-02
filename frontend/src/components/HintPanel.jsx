import React, { useState } from 'react';
import { getHint } from '../api/apiClient';
import { Lightbulb, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

const HintPanel = ({ problemId }) => {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  const fetchNextHint = async () => {
    if (currentLevel >= 4) return;
    setLoading(true);
    try {
      const nextLevel = currentLevel + 1;
      const data = await getHint(problemId, nextLevel);
      setHints([...hints, { level: nextLevel, content: data.content }]);
      setCurrentLevel(nextLevel);
    } catch (err) {
      console.error("Failed to fetch hint", err);
      // Dummy fallback for demo purposes if backend is down
      const nextLevel = currentLevel + 1;
      setHints([...hints, { level: nextLevel, content: `Mock AI Hint for Level ${nextLevel}` }]);
      setCurrentLevel(nextLevel);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-800 font-medium">
          <Lightbulb className="w-5 h-5" />
          Socratic Hints
        </div>
        <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
          Level {currentLevel}/4
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {hints.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Stuck? Ask for a guiding question to get started.</p>
          </div>
        ) : (
          hints.map((hint, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Hint Level {hint.level}</div>
              <div className="text-gray-800 text-sm whitespace-pre-wrap">{hint.content}</div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={fetchNextHint}
          disabled={loading || currentLevel >= 4}
          className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentLevel >= 4 ? (
            "Max Hints Reached"
          ) : (
            <>
              Get Hint (Level {currentLevel + 1})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HintPanel;
