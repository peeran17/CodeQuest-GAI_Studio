import React from 'react';
import { 
  Flame, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Diamond, 
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { UserStats } from '../types';
import { playSound } from '../utils/audio';

interface DailyQuestsModalProps {
  stats: UserStats;
  onClose: () => void;
  onClaimQuest: (questId: string, xpReward: number, gemsReward: number) => void;
  onOpenShop: () => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  stats,
  onClose,
  onClaimQuest,
  onOpenShop,
}) => {
  // Generate past 14 days for streak calendar
  const today = new Date();
  const pastDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 13;
    const isDone = stats.streakHistory?.includes(dateStr) || (isToday && stats.streak > 0);
    return {
      dateStr,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isDone,
      isToday,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-indigo-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border-2 border-rose-200 flex items-center justify-center shadow-xs">
              <Flame className="w-7 h-7 fill-rose-500 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Daily Streak & Quests</h2>
              <p className="text-xs text-slate-500 font-medium">Keep your coding habit alive every single day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 text-xl font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 14-Day Streak Calendar Grid */}
        <div className="bg-indigo-50/70 border-2 border-indigo-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-950">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>14-Day Activity Heatmap</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <Flame className="w-4 h-4 fill-rose-600" />
              <span>{stats.streak} Day Active Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
            {pastDays.map(day => (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  day.isDone
                    ? 'bg-amber-100 border-2 border-amber-300 text-amber-900 font-black'
                    : 'bg-white border-slate-200 text-slate-400'
                } ${day.isToday ? 'ring-2 ring-indigo-500 font-black' : ''}`}
              >
                <span className="text-[9px] uppercase font-bold text-slate-500">{day.dayName}</span>
                <span className="text-xs font-black mt-0.5">{day.dayNum}</span>
                <div className="mt-1">
                  {day.isDone ? (
                    <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Streak Freeze Banner */}
          <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Streak Freeze Protection: <strong>{stats.streakFreezeCount} Equipped</strong></span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="text-indigo-600 hover:text-indigo-800 font-black transition-colors cursor-pointer"
            >
              Get More in Shop →
            </button>
          </div>
        </div>

        {/* Today's 3 Daily Missions */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Today's Missions
          </h3>

          {stats.dailyQuests.map(quest => {
            const isCompleted = quest.current >= quest.target;

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  quest.claimed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-indigo-100 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  }`}>
                    {quest.icon === 'Zap' ? <Zap className="w-5 h-5" /> : quest.icon === 'Sparkles' ? <Sparkles className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{quest.title}</h4>
                      <span className="text-xs text-amber-700 font-black flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3" /> +{quest.xpReward} XP
                      </span>
                      <span className="text-xs text-cyan-700 font-black bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        💎 +{quest.gemsReward}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{quest.description}</p>
                    
                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 mt-2 max-w-xs">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"
                          style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        {quest.current}/{quest.target}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex justify-end">
                  {quest.claimed ? (
                    <span className="text-xs font-black text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Claimed
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        playSound('gem', stats.soundEnabled);
                        onClaimQuest(quest.id, quest.xpReward, quest.gemsReward);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-0.5 border-b-4 border-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      Claim Reward!
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:border-b-0 active:translate-y-0.5 border-b-4 border-indigo-800 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
