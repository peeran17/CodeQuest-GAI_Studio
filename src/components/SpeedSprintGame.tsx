import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Timer, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  Play,
  ArrowLeft
} from 'lucide-react';
import { UserStats } from '../types';
import { playSound } from '../utils/audio';

interface SpeedSprintGameProps {
  stats: UserStats;
  onBack: () => void;
  onFinishGame: (earnedXp: number, score: number) => void;
}

const SPRINT_SNIPPETS = [
  { prompt: 'Declare an arrow function:', target: 'const add = (a, b) => a + b;', lang: 'js' },
  { prompt: 'Python list comprehension:', target: 'evens = [x for x in nums if x % 2 == 0]', lang: 'py' },
  { prompt: 'SQL basic select:', target: 'SELECT name, salary FROM users WHERE active = true;', lang: 'sql' },
  { prompt: 'React state hook:', target: 'const [isOpen, setIsOpen] = useState(false);', lang: 'js' },
  { prompt: 'Python dictionary lookup:', target: 'count = counts.get(word, 0) + 1', lang: 'py' },
  { prompt: 'Async promise await:', target: 'const data = await response.json();', lang: 'js' },
  { prompt: 'CSS flexbox center:', target: 'display: flex; justify-content: center; align-items: center;', lang: 'css' },
  { prompt: 'Python string formatting:', target: 'print(f"User {user.name} logged in")', lang: 'py' },
  { prompt: 'Rust match expression:', target: 'match result { Ok(val) => val, Err(e) => panic!(e) };', lang: 'rust' },
  { prompt: 'SQL join clause:', target: 'JOIN departments ON users.dept_id = departments.id', lang: 'sql' },
];

export const SpeedSprintGame: React.FC<SpeedSprintGameProps> = ({
  stats,
  onBack,
  onFinishGame,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'game_over'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStart = () => {
    setGameState('playing');
    setTimeLeft(60);
    setScore(0);
    setCombo(1);
    setSolvedCount(0);
    setCurrentIndex(0);
    setInputVal('');
    playSound('fanfare', stats.soundEnabled);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleGameOver = () => {
    setGameState('game_over');
    playSound('levelUp', stats.soundEnabled);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const earnedXp = Math.max(20, Math.round(score / 8));
    onFinishGame(earnedXp, score);
  };

  const currentSnippet = SPRINT_SNIPPETS[currentIndex % SPRINT_SNIPPETS.length];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim() === currentSnippet.target.trim()) {
      // Correct!
      playSound('success', stats.soundEnabled);
      const points = 50 * combo;
      setScore(prev => prev + points);
      setCombo(prev => Math.min(5, prev + 1));
      setSolvedCount(prev => prev + 1);
      setInputVal('');
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-2xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
              <span>Speed Syntax Sprint</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              60 seconds. Type accurate code syntax at lightning speed!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-amber-50 border-2 border-amber-200 px-4 py-1.5 rounded-2xl">
            <div className="text-[10px] uppercase font-black text-amber-700">High Score</div>
            <div className="text-sm font-black text-amber-900">{stats.speedSprintHighScore} pts</div>
          </div>
        </div>
      </div>

      {/* Main Game State Box */}
      {gameState === 'idle' && (
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-xs space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-xs">
            <Zap className="w-10 h-10 fill-emerald-600" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Ready for the Sprint?</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              Train muscle memory and coding speed. Complete as many syntax snippets as you can in 60 seconds! Keep streaks going for combo multiplier boosts.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-0.5 border-b-4 border-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start 60s Sprint</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          
          {/* Heads Up Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 bg-white border-2 border-indigo-100 rounded-2xl shadow-xs">
              <div className="text-[10px] text-slate-500 font-black uppercase flex items-center justify-center gap-1">
                <Timer className="w-3.5 h-3.5 text-rose-500" /> Time Left
              </div>
              <div className={`text-2xl font-black mt-0.5 ${timeLeft <= 10 ? 'text-rose-600 animate-ping' : 'text-slate-900'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="p-3.5 bg-white border-2 border-indigo-100 rounded-2xl shadow-xs">
              <div className="text-[10px] text-slate-500 font-black uppercase flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Multiplier
              </div>
              <div className="text-2xl font-black text-rose-600 mt-0.5">
                {combo}X
              </div>
            </div>

            <div className="p-3.5 bg-white border-2 border-indigo-100 rounded-2xl shadow-xs">
              <div className="text-[10px] text-slate-500 font-black uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Score
              </div>
              <div className="text-2xl font-black text-amber-600 mt-0.5">
                {score}
              </div>
            </div>
          </div>

          {/* Snippet Card */}
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-black">
              <span className="text-indigo-600">{currentSnippet.prompt}</span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {currentSnippet.lang}
              </span>
            </div>

            {/* Target Code to Match */}
            <div className="p-4 bg-slate-900 rounded-2xl border-2 border-slate-800 font-mono text-sm sm:text-base text-emerald-400 font-bold select-none tracking-wide shadow-inner">
              {currentSnippet.target}
            </div>

            {/* User Input Field */}
            <div>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                spellCheck={false}
                autoFocus
                placeholder="Type the exact code above..."
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-indigo-200 text-slate-900 font-mono text-sm font-bold focus:outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
          </div>

        </div>
      )}

      {gameState === 'game_over' && (
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-md border-b-4 border-amber-400 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-xs">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Sprint Complete!</h2>
            <div className="text-4xl font-black text-amber-700 mt-2 mb-1">{score} Points</div>
            <p className="text-xs text-slate-600 font-medium">
              You accurately completed {solvedCount} code snippets under 60 seconds!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-0.5 border-b-4 border-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Back to Path
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
