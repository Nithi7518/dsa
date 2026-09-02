import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../api/apiClient';
import { Code2, ChevronRight, Activity } from 'lucide-react';

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    EASY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
    HARD: 'bg-rose-100 text-rose-800 border-rose-200'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[difficulty] || 'bg-gray-100'}`}>
      {difficulty}
    </span>
  );
};

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the backend
    // For now, if the backend is down, we use dummy data
    const fetchProblems = async () => {
      try {
        const data = await getProblems();
        setProblems(data);
      } catch (err) {
        console.log("Using mock data since backend failed", err);
        setProblems([
          { id: 1, title: 'Two Sum', difficulty: 'EASY', tags: ['Array', 'Hash Table'] },
          { id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', tags: ['Hash Table', 'Sliding Window'] },
          { id: 3, title: 'Trapping Rain Water', difficulty: 'HARD', tags: ['Array', 'Two Pointers'] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500"><Activity className="animate-spin w-6 h-6 mr-2" /> Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Set</h1>
        <p className="text-gray-600">Master Data Structures and Algorithms with AI-guided Socratic hints.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {problems.map((p) => (
            <li key={p.id}>
              <Link to={`/problems/${p.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Code2 className="text-gray-400 w-5 h-5" />
                      <span className="text-lg font-medium text-gray-900">{p.id}. {p.title}</span>
                      <DifficultyBadge difficulty={p.difficulty} />
                    </div>
                    {p.tags && (
                      <div className="flex gap-2 ml-8">
                        {p.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemList;
