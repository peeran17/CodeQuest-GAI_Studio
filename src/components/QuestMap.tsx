import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Bug, 
  Code2, 
  Layers, 
  Eye, 
  Zap, 
  Flame, 
  Trophy, 
  Bot,
  ArrowRight,
  Star
} from 'lucide-react';
import { Challenge, Language, UserStats } from '../types';
import { LANGUAGE_TRACKS } from '../data/challenges';
import { playSound } from '../utils/audio';

interface QuestMapProps {
  stats: UserStats;
  onSelectChallenge: (challenge: Challenge) => void;
  onOpenDaily: () => void;
  onOpenAiStudio: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export const QuestMap: React.FC<QuestMapProps> = ({
  stats,
  onSelectChallenge,
  onOpenDaily,
  onOpenAiStudio,
  onSelectLanguage,
}) => {
  const currentTrack = LANGUAGE_TRACKS.find(t => t.id === stats.selectedLanguage) || LANGUAGE_TRACKS[0];

  // Calculate track progress
  const allTrackChallenges = currentTrack.modules.flatMap(m => m.challenges);
  const completedInTrack = allTrackChallenges.filter(c => stats.completedChallengeIds.includes(c.id));
  const trackProgressPct = allTrackChallenges.length > 0
    ? Math.round((completedInTrack.length / allTrackChallenges.length) * 100)
    : 0;

  const getChallengeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'bug_hunt':
        return <Bug className="w-5 h-5" />;
      case 'code_blocks':
        return <Layers className="w-5 h-5" />;
      case 'predict_output':
        return <Eye className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  const getChallengeTypeLabel = (type: Challenge['type']) => {
    switch (type) {
      case 'bug_hunt':
        return 'Bug Hunt';
      case 'code_blocks':
        return 'Code Blocks';
      case 'predict_output':
        return 'Predict Output';
      default:
        return 'Code Exercise';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Track Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 mb-8 shadow-md border-b-4 border-indigo-900">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/25 flex items-center justify-center text-3xl shadow-inner">
              {currentTrack.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  {currentTrack.name} Track
                </span>
                <span className="text-xs font-bold text-indigo-100">
                  {completedInTrack.length} of {allTrackChallenges.length} Lessons Completed
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentTrack.tagline}
              </h1>
              <p className="text-sm text-indigo-100/90 max-w-2xl mt-1 font-medium">
                {currentTrack.description}
              </p>
            </div>
          </div>

          {/* Quick Track Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {LANGUAGE_TRACKS.map(track => {
              const isSelected = track.id === stats.selectedLanguage;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    playSound('click', stats.soundEnabled);
                    onSelectLanguage(track.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-indigo-950 shadow-md scale-105 border-b-2 border-indigo-200'
                      : 'bg-indigo-800/60 hover:bg-indigo-800 text-indigo-100 border border-indigo-400/40'
                  }`}
                >
                  <span>{track.icon}</span>
                  <span>{track.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs font-bold text-indigo-100 mb-1.5">
              <span>Path Mastery</span>
              <span className="font-black text-white">{trackProgressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${trackProgressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-2 text-xs font-extrabold text-amber-900 bg-amber-400 hover:bg-amber-300 border-b-2 border-amber-600 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer active:translate-y-0.5"
            >
              <Flame className="w-4 h-4 fill-amber-900" />
              <span>Daily Missions</span>
            </button>

            <button
              onClick={onOpenAiStudio}
              className="flex items-center gap-2 text-xs font-extrabold text-purple-950 bg-white hover:bg-purple-50 border-b-2 border-purple-300 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer active:translate-y-0.5"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Generate AI Quest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Quest Path Nodes & Side Quick Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Quest Skill Tree Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          {currentTrack.modules.map((module, modIdx) => {
            const modChallenges = module.challenges;
            const completedInModule = modChallenges.filter(c => stats.completedChallengeIds.includes(c.id));
            const isModuleComplete = completedInModule.length === modChallenges.length;

            return (
              <div 
                key={module.id} 
                className="bg-white border-2 border-indigo-100 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs"
              >
                {/* Module Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-50 mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        Module {modIdx + 1}
                      </span>
                      {isModuleComplete && (
                        <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Mastered
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                      {module.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {module.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                      Progress: {completedInModule.length}/{modChallenges.length}
                    </span>
                  </div>
                </div>

                {/* Vertical Interactive Node Path */}
                <div className="relative flex flex-col items-center space-y-7 py-2">
                  
                  {/* Visual Background Center Cable Line */}
                  <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1.5 bg-indigo-100 z-0 rounded-full" />

                  {modChallenges.map((challenge, chIdx) => {
                    const isCompleted = stats.completedChallengeIds.includes(challenge.id);
                    
                    // A challenge is unlocked if it's completed, OR if the previous one is completed, OR it's the very first challenge of module 1
                    const prevChallenge = chIdx > 0 ? modChallenges[chIdx - 1] : (modIdx > 0 ? currentTrack.modules[modIdx - 1].challenges.slice(-1)[0] : null);
                    const isUnlocked = isCompleted || !prevChallenge || stats.completedChallengeIds.includes(prevChallenge.id);

                    // Alternate left / center / right offsets for classic Duolingo curve feel
                    const offsets = ['translate-x-0', '-translate-x-12 sm:-translate-x-20', 'translate-x-12 sm:translate-x-20', 'translate-x-0'];
                    const offsetClass = offsets[chIdx % offsets.length];

                    return (
                      <div
                        key={challenge.id}
                        className={`relative z-10 flex flex-col items-center group transition-transform ${offsetClass}`}
                      >
                        {/* Interactive Node Button */}
                        <button
                          disabled={!isUnlocked}
                          onClick={() => {
                            playSound('click', stats.soundEnabled);
                            onSelectChallenge(challenge);
                          }}
                          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 shadow-md hover:scale-110 ring-4 ring-emerald-100'
                              : isUnlocked
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 shadow-lg shadow-indigo-500/25 hover:scale-110 animate-bounce hover:animate-none ring-4 ring-indigo-100'
                              : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed opacity-80'
                          }`}
                        >
                          {/* Inner Node Icon */}
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                          ) : isUnlocked ? (
                            <div className="flex flex-col items-center">
                              {getChallengeIcon(challenge.type)}
                              <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">Play</span>
                            </div>
                          ) : (
                            <Lock className="w-6 h-6" />
                          )}

                          {/* XP Star Pin */}
                          <div className="absolute -top-2 -right-2 bg-amber-400 border border-amber-500 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-amber-950" />
                            <span>+{challenge.xpReward}</span>
                          </div>
                        </button>

                        {/* Node Card Details (Title & Tag) */}
                        <div className="mt-2.5 text-center max-w-[200px]">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {challenge.title}
                          </div>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {getChallengeTypeLabel(challenge.type)}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar: Daily Progress, Streaks & Fast Stats */}
        <div className="space-y-6">
          
          {/* Daily Goal Card */}
          <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h3 className="font-extrabold text-slate-900 text-sm">Daily Quests</h3>
              </div>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {stats.streak} Day Streak!
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-4">
              Complete your daily objectives to earn bonus Gems, double XP, and protect your streak.
            </p>

            <div className="space-y-3">
              {stats.dailyQuests.map((quest) => (
                <div key={quest.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-800">{quest.title}</span>
                    <span className="text-slate-500 font-black">{quest.current}/{quest.target}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenDaily}
              className="mt-5 w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border-2 border-orange-200 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Daily Calendar & Rewards</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick AI Mentor Banner */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white border-2 border-purple-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shadow-xs">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Need a custom challenge?</h3>
                <p className="text-[11px] text-purple-700 font-bold">Powered by Gemini 3.7 Flash</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Prompt any topic you want to master—from binary trees to SQL joins—and our AI will craft an interactive exercise.
            </p>
            <button
              onClick={onOpenAiStudio}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:border-b-0 active:translate-y-0.5 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 border-b-4 border-purple-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open AI Challenge Generator</span>
            </button>
          </div>

          {/* Player Lifetime Stats Mini-card */}
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xs text-xs space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Your Accomplishments</h4>
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                <div className="text-lg font-black text-indigo-700">{stats.solvedChallengesCount}</div>
                <div className="text-[10px] text-slate-500 font-bold">Challenges Solved</div>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">{stats.perfectRunsCount}</div>
                <div className="text-[10px] text-slate-500 font-bold">Perfect First Tries</div>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                <div className="text-lg font-black text-amber-700">{stats.xp}</div>
                <div className="text-[10px] text-slate-500 font-bold">Lifetime XP</div>
              </div>
              <div className="p-3 bg-cyan-50/70 rounded-2xl border border-cyan-100">
                <div className="text-lg font-black text-cyan-700">{stats.gems}</div>
                <div className="text-[10px] text-slate-500 font-bold">Gems Collected</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
