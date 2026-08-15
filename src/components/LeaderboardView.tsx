import React from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ShieldAlert, 
  Medal,
  ChevronUp,
  Award
} from 'lucide-react';
import { LeaderboardUser, UserStats } from '../types';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';

interface LeaderboardViewProps {
  stats: UserStats;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats }) => {
  // Merge current user dynamically into leaderboard rankings
  const currentUser: LeaderboardUser = {
    id: 'current_user',
    name: stats.username || 'You',
    avatar: stats.avatar || '🚀',
    xp: stats.xp,
    streak: stats.streak,
    league: stats.xp > 2000 ? 'Diamond' : stats.xp > 1200 ? 'Gold' : stats.xp > 600 ? 'Silver' : 'Bronze',
    rank: 1,
    isCurrentUser: true,
    title: 'Code Aspirant',
    favoriteLanguage: stats.selectedLanguage,
  };

  // Combine and sort by XP descending
  const combined = [...INITIAL_LEADERBOARD.filter(u => u.id !== 'current_user'), currentUser].sort((a, b) => b.xp - a.xp);

  // Assign ranks
  const rankedUsers = combined.map((u, i) => ({ ...u, rank: i + 1 }));
  const top3 = rankedUsers.slice(0, 3);
  const restUsers = rankedUsers.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 border-2 border-amber-200 rounded-full text-amber-800 text-xs font-black mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>Weekly League Tournament</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Global Dev Leaderboard
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 font-medium">
          Top 3 players at the end of the week earn bonus 💎 Gems & exclusive badge flairs!
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 items-end max-w-2xl mx-auto">
        
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div className="flex flex-col items-center p-4 sm:p-5 bg-white border-2 border-indigo-100 rounded-3xl text-center shadow-xs relative order-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center -mt-8 mb-2 border-2 border-slate-300 shadow-xs">
              #2
            </div>
            <div className="text-2xl sm:text-3xl mb-1">{top3[1].avatar}</div>
            <div className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-full">
              {top3[1].name}
            </div>
            <div className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mt-1">
              {top3[1].xp} XP
            </div>
            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{top3[1].streak}d</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top3[0] && (
          <div className="flex flex-col items-center p-5 sm:p-6 bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-3xl text-center shadow-md relative order-2 scale-105 border-b-4 border-amber-400">
            <Crown className="w-8 h-8 text-amber-500 fill-amber-400 -mt-10 mb-1 animate-bounce" />
            <div className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center mb-2 shadow-xs border border-amber-500">
              #1
            </div>
            <div className="text-3xl sm:text-4xl mb-1">{top3[0].avatar}</div>
            <div className="font-black text-sm sm:text-base text-slate-900 truncate max-w-full">
              {top3[0].name}
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 mt-1">
              {top3[0].xp} XP
            </div>
            <div className="text-[10px] text-amber-900 flex items-center gap-1 mt-1 font-black">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{top3[0].streak}d streak</span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div className="flex flex-col items-center p-4 sm:p-5 bg-white border-2 border-indigo-100 rounded-3xl text-center shadow-xs relative order-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center -mt-8 mb-2 border-2 border-amber-300 shadow-xs">
              #3
            </div>
            <div className="text-2xl sm:text-3xl mb-1">{top3[2].avatar}</div>
            <div className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-full">
              {top3[2].name}
            </div>
            <div className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mt-1">
              {top3[2].xp} XP
            </div>
            <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{top3[2].streak}d</span>
            </div>
          </div>
        )}

      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white border-2 border-indigo-100 rounded-3xl overflow-hidden shadow-xs">
        
        <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-950 font-black uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Developer</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Streak</span>
            <span className="w-16 text-right">Weekly XP</span>
          </div>
        </div>

        <div className="divide-y divide-indigo-50">
          {rankedUsers.map((user) => {
            const isUser = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isUser
                    ? 'bg-indigo-50/80 border-l-4 border-indigo-600 text-slate-900 font-black'
                    : 'hover:bg-indigo-50/30 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-mono font-black text-sm">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        {user.name} {isUser && '(You)'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {user.league}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{user.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <Flame className="w-3.5 h-3.5 fill-rose-600" />
                    <span>{user.streak}d</span>
                  </div>

                  <div className="w-16 text-right font-black text-amber-700 text-sm">
                    {user.xp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
