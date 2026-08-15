import React from 'react';
import { 
  Flame, 
  Heart, 
  Diamond, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Trophy, 
  ShoppingBag, 
  Zap, 
  Code2, 
  Calendar,
  Bot
} from 'lucide-react';
import { Language, UserStats } from '../types';
import { calculateLevel } from '../utils/storage';
import { LANGUAGE_TRACKS } from '../data/challenges';

interface NavbarProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onOpenDaily: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenSprint: () => void;
  onOpenPlayground: () => void;
  onOpenAiStudio: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  onUpdateStats,
  onOpenDaily,
  onOpenShop,
  onOpenLeaderboard,
  onOpenSprint,
  onOpenPlayground,
  onOpenAiStudio,
  onSelectLanguage,
}) => {
  const levelInfo = calculateLevel(stats.xp);
  const currentTrack = LANGUAGE_TRACKS.find(t => t.id === stats.selectedLanguage) || LANGUAGE_TRACKS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs text-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Language Selector */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onUpdateStats({ activeTab: 'map' })}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform border border-indigo-400/30">
              <Code2 className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-indigo-950">
                  CodeQuest
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                  Daily
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold hidden sm:block">
                Gamified Code Mastery
              </p>
            </div>
          </button>

          {/* Language Switcher Pill */}
          <div className="relative ml-2">
            <select
              value={stats.selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as Language)}
              className="bg-indigo-50/80 hover:bg-indigo-100/70 text-indigo-900 text-xs font-bold py-1.5 px-3 pr-8 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer appearance-none shadow-xs"
            >
              {LANGUAGE_TRACKS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Center Quick Nav Icons (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            onClick={() => onUpdateStats({ activeTab: 'map' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'map'
                ? 'bg-indigo-600 text-white shadow-sm border-b-2 border-indigo-800'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <span>{currentTrack.icon}</span>
            <span>Skill Tree</span>
          </button>

          <button
            onClick={onOpenDaily}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'daily'
                ? 'bg-indigo-600 text-white shadow-sm border-b-2 border-indigo-800'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Quests</span>
          </button>

          <button
            onClick={onOpenSprint}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'sprint'
                ? 'bg-indigo-600 text-white shadow-sm border-b-2 border-indigo-800'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Speed Sprint</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'leaderboard'
                ? 'bg-indigo-600 text-white shadow-sm border-b-2 border-indigo-800'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={onOpenPlayground}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm border-b-2 border-indigo-800'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>Playground</span>
          </button>

          <button
            onClick={onOpenAiStudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stats.activeTab === 'ai_studio'
                ? 'bg-purple-600 text-white shadow-sm border-b-2 border-purple-800'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Studio</span>
          </button>
        </nav>

        {/* Gamified HUD Stats (Streak, Hearts, Gems, Level, XP) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Streak Flame Counter */}
          <button
            onClick={onOpenDaily}
            title={`${stats.streak} day streak! Click for daily calendar & quests`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100/90 border-2 border-orange-200 rounded-xl text-xs font-black text-orange-700 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{stats.streak}</span>
          </button>

          {/* Hearts Life Tracker */}
          <button
            onClick={onOpenShop}
            title={`${stats.hearts}/${stats.maxHearts} Hearts. Click to refill in Shop.`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100/90 border-2 border-rose-200 rounded-xl text-xs font-black text-rose-700 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{stats.hearts}</span>
          </button>

          {/* Gems Wallet */}
          <button
            onClick={onOpenShop}
            title={`${stats.gems} Gems. Click to visit Shop.`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100/90 border-2 border-cyan-200 rounded-xl text-xs font-black text-cyan-800 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Diamond className="w-4 h-4 text-cyan-600 fill-cyan-500" />
            <span>{stats.gems}</span>
          </button>

          {/* XP & Level Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white border-2 border-indigo-100 rounded-2xl shadow-xs">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
              L{levelInfo.level}
            </div>
            <div className="w-20">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>XP</span>
                <span className="text-indigo-950 font-black">{stats.xp}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateStats({ soundEnabled: !stats.soundEnabled })}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
            title={stats.soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Shop Quick Trigger */}
          <button
            onClick={onOpenShop}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-colors cursor-pointer"
            title="Rewards Shop"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="flex md:hidden border-t border-indigo-100 bg-white/95 px-2 py-1.5 justify-around text-xs shadow-xs">
        <button
          onClick={() => onUpdateStats({ activeTab: 'map' })}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'map' ? 'text-indigo-600 font-black' : 'text-slate-500'
          }`}
        >
          <span>{currentTrack.icon}</span>
          <span className="text-[10px] mt-0.5">Learn</span>
        </button>

        <button
          onClick={onOpenDaily}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'daily' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Daily</span>
        </button>

        <button
          onClick={onOpenSprint}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'sprint' ? 'text-emerald-600 font-black' : 'text-slate-500'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Sprint</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'leaderboard' ? 'text-yellow-600 font-black' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Leagues</span>
        </button>

        <button
          onClick={onOpenPlayground}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'playground' ? 'text-cyan-600 font-black' : 'text-slate-500'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Editor</span>
        </button>

        <button
          onClick={onOpenAiStudio}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            stats.activeTab === 'ai_studio' ? 'text-purple-600 font-black' : 'text-slate-500'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">AI</span>
        </button>
      </div>
    </header>
  );
};
