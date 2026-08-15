import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Loader2, 
  Play, 
  BookOpen, 
  Flame, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { Challenge, Difficulty, Language, UserStats } from '../types';
import { playSound } from '../utils/audio';

interface DynamicChallengeModalProps {
  stats: UserStats;
  onClose: () => void;
  onPlayCustomChallenge: (challenge: Challenge) => void;
}

const PRESET_TOPICS = [
  'Binary Search algorithm',
  'Two Pointers technique',
  'SQL LEFT JOIN with Aggregations',
  'CSS Flexbox Holy Grail Layout',
  'Async Promise.all fetcher',
  'Palindrome number check',
  'Frequency Map counter',
  'Reverse Linked List logic',
];

export const DynamicChallengeModal: React.FC<DynamicChallengeModalProps> = ({
  stats,
  onClose,
  onPlayCustomChallenge,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(stats.selectedLanguage);
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please specify a topic or select one of the suggested prompts below.');
      return;
    }

    setIsLoading(true);
    setError('');
    playSound('click', stats.soundEnabled);

    try {
      const res = await fetch('/api/mentor/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLanguage,
          topic: topic.trim(),
          difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error generating challenge.');
      }

      const generated: Challenge = await res.json();
      playSound('fanfare', stats.soundEnabled);
      onPlayCustomChallenge(generated);
    } catch (err: any) {
      setError(err.message || 'Could not generate challenge right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-purple-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border-2 border-purple-200 flex items-center justify-center shadow-xs">
              <Bot className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">AI Challenge Studio</h2>
              <p className="text-xs text-purple-700 font-medium">Generate custom gamified exercises on any topic with Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 text-xl font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Configuration Form */}
        <div className="space-y-5">
          
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Target Language
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['python', 'javascript', 'sql', 'html_css', 'rust'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`py-2 px-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-purple-600 border-purple-700 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-200 hover:text-purple-700'
                  }`}
                >
                  {lang === 'html_css' ? 'HTML/CSS' : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Topic / Concept Focus
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Binary Search Tree traversal, SQL grouping, Flexbox cards..."
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-black text-slate-500 block mb-2">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopic(preset)}
                  className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-[11px] font-bold border border-purple-200 transition-colors cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-900 font-bold">
              {error}
            </div>
          )}

        </div>

        {/* Footer & Generate Button */}
        <div className="mt-8 pt-4 border-t border-purple-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:border-b-0 active:translate-y-0.5 border-b-4 border-purple-800 text-white font-black text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Challenge with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Play Challenge</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
