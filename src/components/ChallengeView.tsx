import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Bot, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Flame, 
  Heart, 
  ShieldAlert, 
  Eye, 
  Bug, 
  Layers, 
  Code2, 
  Database,
  Check,
  ChevronRight,
  Loader2,
  Share2
} from 'lucide-react';
import { Challenge, CodeBlockItem, CodeExecutionResult, UserStats } from '../types';
import { runJavaScriptCode, runPythonCode, runSqlQuery } from '../utils/codeRunner';
import { playSound } from '../utils/audio';

interface ChallengeViewProps {
  challenge: Challenge;
  stats: UserStats;
  onBack: () => void;
  onSuccess: (earnedXp: number, earnedGems: number) => void;
  onDeductHeart: () => void;
  onOpenShop: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  stats,
  onBack,
  onSuccess,
  onDeductHeart,
  onOpenShop,
}) => {
  const [userCode, setUserCode] = useState<string>(challenge.starterCode);
  const [blocks, setBlocks] = useState<CodeBlockItem[]>(() => {
    if (challenge.codeBlocks) {
      // Shuffle initially
      return [...challenge.codeBlocks].sort(() => Math.random() - 0.5);
    }
    return [];
  });
  const [selectedPredictIdx, setSelectedPredictIdx] = useState<number | null>(null);
  const [predictRevealed, setPredictRevealed] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<CodeExecutionResult | null>(null);
  const [hasSolved, setHasSolved] = useState<boolean>(stats.completedChallengeIds.includes(challenge.id));
  const [attempts, setAttempts] = useState<number>(0);

  // AI Mentor States
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiModalMode, setAiModalMode] = useState<'hint' | 'review' | 'concept'>('hint');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiReviewData, setAiReviewData] = useState<any>(null);

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<'test_cases' | 'console' | 'sql_tables' | 'html_preview'>('test_cases');

  // Reset when challenge changes
  useEffect(() => {
    setUserCode(challenge.starterCode);
    setExecResult(null);
    setAttempts(0);
    setSelectedPredictIdx(null);
    setPredictRevealed(false);
    if (challenge.codeBlocks) {
      setBlocks([...challenge.codeBlocks].sort(() => Math.random() - 0.5));
    }
    if (challenge.language === 'sql') {
      setActiveTab('sql_tables');
    } else if (challenge.htmlCssPreview) {
      setActiveTab('html_preview');
    } else {
      setActiveTab('test_cases');
    }
  }, [challenge.id]);

  const handleRunCode = async () => {
    if (stats.hearts <= 0) {
      playSound('error', stats.soundEnabled);
      return;
    }

    setIsRunning(true);
    playSound('click', stats.soundEnabled);
    setAttempts(prev => prev + 1);

    try {
      let result: CodeExecutionResult;

      if (challenge.language === 'javascript') {
        result = await runJavaScriptCode(userCode, challenge.testCases);
      } else if (challenge.language === 'python') {
        result = await runPythonCode(userCode, challenge.testCases);
      } else if (challenge.language === 'sql') {
        result = await runSqlQuery(userCode, challenge.expectedSqlResult);
      } else {
        // Fallback generic execution
        result = await runJavaScriptCode(userCode, challenge.testCases);
      }

      setExecResult(result);

      if (result.success) {
        handleVictory();
      } else {
        playSound('error', stats.soundEnabled);
        onDeductHeart();
      }
    } catch (err: any) {
      setExecResult({
        success: false,
        output: '',
        error: `Runtime Exception: ${err.message}`,
        executionTimeMs: 0,
      });
      playSound('error', stats.soundEnabled);
      onDeductHeart();
    } finally {
      setIsRunning(false);
    }
  };

  const handleCheckBlocks = () => {
    const isCorrect = blocks.every((b, idx) => b.correctIndex === idx);
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setExecResult({
        success: true,
        output: 'All code blocks aligned in correct execution sequence!',
        executionTimeMs: 12,
      });
      handleVictory();
    } else {
      setExecResult({
        success: false,
        output: 'The sequence of code blocks is incorrect. Check the logical flow and try again.',
        error: 'Order mismatch detected.',
        executionTimeMs: 8,
      });
      playSound('error', stats.soundEnabled);
      onDeductHeart();
    }
  };

  const handleSelectPredictOption = (idx: number) => {
    if (predictRevealed) return;
    setSelectedPredictIdx(idx);
    setPredictRevealed(true);
    setAttempts(prev => prev + 1);

    const option = challenge.predictOptions?.[idx];
    if (option?.correct) {
      setExecResult({
        success: true,
        output: `Correct! ${option.explanation}`,
        executionTimeMs: 5,
      });
      handleVictory();
    } else {
      setExecResult({
        success: false,
        output: option?.explanation || 'Incorrect prediction.',
        error: 'Prediction was incorrect.',
        executionTimeMs: 5,
      });
      playSound('error', stats.soundEnabled);
      onDeductHeart();
    }
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    playSound('click', stats.soundEnabled);
    const updated = [...blocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setBlocks(updated);
  };

  const handleVictory = () => {
    setHasSolved(true);
    playSound('success', stats.soundEnabled);

    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#f59e0b', '#38bdf8'],
      });
    } catch (e) {}

    let earnedXp = challenge.xpReward;
    if (stats.doubleXpRemaining > 0) {
      earnedXp *= 2;
    }

    onSuccess(earnedXp, challenge.gemsReward);
  };

  const handleRequestAi = async (mode: 'hint' | 'review' | 'concept') => {
    setAiModalMode(mode);
    setShowAiModal(true);
    setAiLoading(true);
    setAiResponse('');
    setAiReviewData(null);
    playSound('click', stats.soundEnabled);

    try {
      if (mode === 'hint') {
        const res = await fetch('/api/mentor/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: challenge.language,
            title: challenge.title,
            instructions: challenge.instructions,
            code: userCode,
            error: execResult?.error || '',
            attempts,
          }),
        });
        const data = await res.json();
        setAiResponse(data.hint || data.fallback || 'Try reviewing variable declarations and edge cases.');
      } else if (mode === 'review') {
        const res = await fetch('/api/mentor/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: challenge.language,
            title: challenge.title,
            code: userCode || challenge.solutionCode,
            isSuccess: hasSolved,
          }),
        });
        const data = await res.json();
        setAiReviewData(data);
      } else if (mode === 'concept') {
        const res = await fetch('/api/mentor/explain-concept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            concept: challenge.tags?.[0] || challenge.title,
            language: challenge.language,
          }),
        });
        const data = await res.json();
        setAiResponse(data.explanation || 'Explore standard patterns for this topic in official guides.');
      }
    } catch (err) {
      setAiResponse('AI Mentor is taking a quick rest. Check standard syntax references or use the hint tab!');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-indigo-100 p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
            title="Back to Skill Tree"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                {challenge.language.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {challenge.difficulty}
              </span>
              {hasSolved && (
                <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Solved
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Action Controls & AI Tutor Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <button
            onClick={() => handleRequestAi('hint')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>AI Hint</span>
          </button>

          <button
            onClick={() => handleRequestAi('review')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border-2 border-purple-200 rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>AI Review</span>
          </button>

          <button
            onClick={() => {
              setUserCode(challenge.starterCode);
              setExecResult(null);
              playSound('click', stats.soundEnabled);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Action Button based on Type */}
          {challenge.type === 'code_blocks' ? (
            <button
              onClick={handleCheckBlocks}
              disabled={stats.hearts <= 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-0.5 text-white rounded-xl text-xs font-black border-b-4 border-emerald-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Check Order</span>
            </button>
          ) : challenge.type === 'predict_output' ? (
            <div className="text-xs text-indigo-700 font-bold italic bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
              Select an option below to test prediction
            </div>
          ) : (
            <button
              onClick={handleRunCode}
              disabled={isRunning || stats.hearts <= 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:border-b-0 active:translate-y-0.5 text-white rounded-xl text-xs font-black border-b-4 border-indigo-800 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{hasSolved ? 'Run Again' : 'Run & Submit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Out of Hearts Warning if 0 */}
      {stats.hearts <= 0 && (
        <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="font-extrabold text-sm text-rose-950">You are out of Hearts!</div>
              <p className="text-xs text-rose-700 font-medium">
                You need at least 1 heart to submit code solutions. Hearts regenerate over time or can be instantly restored in the Shop.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenShop}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 border-b-4 border-rose-800 text-white font-black text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
          >
            Refill in Shop (100 Gems)
          </button>
        </div>
      )}

      {/* Main Workspace Split: Left Instructions/Story vs Right Editor/Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Instructions, Story, Hint, Tags (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Instructions & Story Card */}
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xs space-y-4">
            
            {challenge.story && (
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950 font-medium italic">
                "{challenge.story}"
              </div>
            )}

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Challenge Objective
              </h3>
              <div className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                {challenge.instructions}
              </div>
            </div>

            {/* Static Built-in Hint Box */}
            {challenge.hint && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-800 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Pro Tip</span>
                </div>
                <p className="font-medium text-amber-900">{challenge.hint}</p>
              </div>
            )}

            {/* Reward & Tag Pill Breakdown */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{challenge.xpReward} XP</span>
                  {stats.doubleXpRemaining > 0 && (
                    <span className="text-[9px] bg-amber-200 px-1 rounded text-amber-900">2X ACTIVE</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 font-black">
                  <span>💎 +{challenge.gemsReward}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {challenge.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Bug Hunt Line Info if active */}
          {challenge.type === 'bug_hunt' && challenge.bugExplanation && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-2 font-black text-amber-800 mb-1">
                <Bug className="w-4 h-4" />
                <span>Bug Detective Clue</span>
              </div>
              <p className="font-medium">{challenge.bugExplanation}</p>
            </div>
          )}

        </div>

        {/* Right Column: Code Editor / Blocks / Quiz / Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Interactive Arena Area */}
          <div className="bg-white border-2 border-indigo-100 rounded-3xl overflow-hidden shadow-xs">
            
            {/* Window Top Bar */}
            <div className="bg-indigo-50/70 px-4 py-2.5 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 font-bold text-indigo-950">
                  {challenge.type === 'code_blocks'
                    ? 'drag_drop_pipeline.py'
                    : challenge.type === 'predict_output'
                    ? 'output_tracer.log'
                    : `solution.${challenge.language === 'python' ? 'py' : challenge.language === 'javascript' ? 'js' : challenge.language === 'sql' ? 'sql' : 'rs'}`}
                </span>
              </div>

              <div className="text-[11px] font-sans font-bold text-indigo-700">
                {challenge.type === 'code_editor' && 'Interactive Code Editor'}
                {challenge.type === 'bug_hunt' && 'Find & Fix Syntax Bug'}
                {challenge.type === 'code_blocks' && 'Reorder Pipeline Blocks'}
                {challenge.type === 'predict_output' && 'Predict Output Quiz'}
              </div>
            </div>

            {/* Arena Content Body based on Challenge Type */}
            <div className="p-4 bg-slate-900">
              
              {/* Type 1: Code Editor & Bug Hunt */}
              {(challenge.type === 'code_editor' || challenge.type === 'bug_hunt') && (
                <div className="relative">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={12}
                    spellCheck={false}
                    className="w-full bg-slate-950 text-emerald-400 font-mono text-sm leading-relaxed p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y selection:bg-indigo-500/40"
                    placeholder="Write your code solution here..."
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 pointer-events-none">
                    {userCode.split('\n').length} lines | {userCode.length} chars
                  </div>
                </div>
              )}

              {/* Type 2: Code Blocks Organizer */}
              {challenge.type === 'code_blocks' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-300 font-medium mb-2">
                    Click the up / down buttons or reorder the code lines into the correct execution flow:
                  </p>
                  {blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl transition-colors font-mono text-xs text-emerald-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-black flex items-center justify-center border border-slate-700">
                          {idx + 1}
                        </span>
                        <span className="whitespace-pre">{block.text}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveBlock(idx, idx - 1)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white disabled:opacity-30 cursor-pointer hover:bg-slate-700"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === blocks.length - 1}
                          onClick={() => moveBlock(idx, idx + 1)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white disabled:opacity-30 cursor-pointer hover:bg-slate-700"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Type 3: Predict Output Quiz */}
              {challenge.type === 'predict_output' && (
                <div className="space-y-4">
                  {/* Code snippet display */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto">
                    {challenge.starterCode}
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-200">
                      {challenge.predictPrompt || 'Select the correct predicted output:'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {challenge.predictOptions?.map((opt, idx) => {
                        const isSelected = selectedPredictIdx === idx;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

                        if (predictRevealed) {
                          if (opt.correct) {
                            btnStyle = 'bg-emerald-950 border-2 border-emerald-400 text-emerald-200 font-bold';
                          } else if (isSelected && !opt.correct) {
                            btnStyle = 'bg-rose-950 border-2 border-rose-400 text-rose-200 line-through';
                          } else {
                            btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={predictRevealed}
                            onClick={() => handleSelectPredictOption(idx)}
                            className={`p-3.5 rounded-2xl border text-xs font-mono text-left transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="flex-1">
                              <div>{opt.text}</div>
                              {predictRevealed && opt.correct && (
                                <div className="text-[10px] text-emerald-400 mt-1 font-sans font-medium">
                                  ✓ {opt.explanation}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Output & Test Results Panel */}
            <div className="border-t border-indigo-100 bg-white">
              
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-indigo-50 text-xs font-bold bg-slate-50">
                {challenge.testCases && challenge.testCases.length > 0 && (
                  <button
                    onClick={() => setActiveTab('test_cases')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'test_cases'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <span>Test Cases ({challenge.testCases.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('console')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'console'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <span>Console & Logs</span>
                </button>

                {challenge.language === 'sql' && (
                  <button
                    onClick={() => setActiveTab('sql_tables')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'sql_tables'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>SQL Output Grid</span>
                  </button>
                )}

                {challenge.htmlCssPreview && (
                  <button
                    onClick={() => setActiveTab('html_preview')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'html_preview'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live UI Preview</span>
                  </button>
                )}

                {execResult && (
                  <div className="ml-auto text-[11px] flex items-center gap-1.5">
                    {execResult.success ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> All Tests Passed ({execResult.executionTimeMs}ms)
                      </span>
                    ) : (
                      <span className="text-rose-700 font-black flex items-center gap-1 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Failed
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Tab Content Display */}
              <div className="p-4 text-xs font-mono max-h-56 overflow-y-auto bg-slate-50/50">
                
                {/* 1. Test Cases Tab */}
                {activeTab === 'test_cases' && (
                  <div className="space-y-2.5">
                    {challenge.testCases?.map((tc, idx) => {
                      const testResult = execResult?.testResults?.[idx];
                      const isPassed = testResult?.passed;
                      
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            testResult
                              ? isPassed
                                ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50 border-2 border-rose-200 text-rose-950'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">
                              Test #{idx + 1}: {tc.description}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Input: <span className="text-indigo-600 font-bold">{tc.input}</span> | Expected: <span className="text-emerald-600 font-bold">{tc.expected}</span>
                            </div>
                          </div>

                          {testResult && (
                            <div className="text-[11px] shrink-0 font-black flex items-center gap-1">
                              {isPassed ? (
                                <span className="text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Passed
                                </span>
                              ) : (
                                <span className="text-rose-700 flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Got: {testResult.actual}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. Console Tab */}
                {activeTab === 'console' && (
                  <div>
                    {execResult ? (
                      <div className="space-y-2">
                        {execResult.output && (
                          <div className="p-3.5 bg-slate-950 rounded-2xl text-slate-200 whitespace-pre-wrap font-mono">
                            {execResult.output}
                          </div>
                        )}
                        {execResult.error && (
                          <div className="p-3.5 bg-rose-950 border border-rose-500/40 rounded-2xl text-rose-300 whitespace-pre-wrap font-mono">
                            {execResult.error}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic p-2">
                        Click "Run & Submit" to execute your solution and see output logs here.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SQL Tables Grid Tab */}
                {activeTab === 'sql_tables' && (
                  <div>
                    {execResult?.sqlRows && execResult.sqlRows.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-indigo-50 text-indigo-950 uppercase text-[10px] font-black">
                            <tr>
                              {Object.keys(execResult.sqlRows[0]).map(col => (
                                <th key={col} className="p-2.5 border-b border-indigo-100">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {execResult.sqlRows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50">
                                {Object.values(row).map((val, cIdx) => (
                                  <td key={cIdx} className="p-2.5 text-slate-800 font-mono">{String(val)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-slate-500 p-2 font-medium">
                        {execResult?.error || 'Run your query to preview tabular SQL result rows.'}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. HTML/CSS Live Preview Tab */}
                {activeTab === 'html_preview' && (
                  <div className="rounded-2xl overflow-hidden border-2 border-indigo-100 bg-white p-2 min-h-[140px]">
                    <iframe
                      title="HTML CSS Live Preview"
                      srcDoc={userCode}
                      sandbox="allow-scripts"
                      className="w-full h-36 border-0 rounded-xl"
                    />
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Victory Card Banner if Solved */}
          {hasSolved && (
            <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border-b-4 border-emerald-800">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30 shadow-inner">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Challenge Mastered!</h4>
                  <p className="text-xs text-emerald-100 font-semibold">
                    Earned +{challenge.xpReward} XP and +{challenge.gemsReward} Gems
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleRequestAi('review')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  Get AI Review
                </button>
                <button
                  onClick={onBack}
                  className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Continue Path →
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* AI Mentor Drawer / Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-purple-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-300 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">AI Coding Mentor</h3>
                  <p className="text-[11px] text-purple-700 font-bold">Gemini 3.7 Flash Interactive Tutor</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* AI Modal Body */}
            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                <p className="text-xs text-slate-600 font-semibold">Analyzing challenge context and code logic...</p>
              </div>
            ) : aiReviewData ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-purple-50 border-2 border-purple-200 rounded-2xl">
                  <div>
                    <span className="text-slate-600 font-bold">Code Rating: </span>
                    <span className="font-black text-purple-900">{aiReviewData.rating}</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    {aiReviewData.efficiency}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 mb-1.5">Key Strengths</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                    {aiReviewData.strengths?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 text-amber-950 font-medium">
                  <h4 className="font-black text-amber-900 mb-0.5">💡 Pro Improvement Tip</h4>
                  <p>{aiReviewData.improvementTip}</p>
                </div>

                <div className="text-slate-600 font-medium leading-relaxed">
                  {aiReviewData.breakdown}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto font-sans font-medium">
                {aiResponse}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
