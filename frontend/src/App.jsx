import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProblemList from './pages/ProblemList';
import ProblemWorkspace from './pages/ProblemWorkspace';
import { BookOpen } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            <BookOpen className="w-6 h-6 text-blue-600" />
            DSA Study Buddy
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">Problems</Link>
          </nav>
        </header>

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<ProblemList />} />
            <Route path="/problems/:id" element={<ProblemWorkspace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
