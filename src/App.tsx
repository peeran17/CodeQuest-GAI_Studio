import React, { useState, useEffect } from 'react';
import { Challenge, Language, UserStats } from './types';
import { calculateLevel, loadUserStats, saveUserStats } from './utils/storage';
import { playSound } from './utils/audio';

import { Navbar } from './components/Navbar';
import { QuestMap } from './components/QuestMap';
import { ChallengeView } from './components/ChallengeView';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { LeaderboardView } from './components/LeaderboardView';
import { ShopView } from './components/ShopView';
import { SpeedSprintGame } from './components/SpeedSprintGame';
import { DynamicChallengeModal } from './components/DynamicChallengeModal';
import { CodePlayground } from './components/CodePlayground';
import { LevelUpModal } from './components/LevelUpModal';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  
  // Modals state
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showAiStudioModal, setShowAiStudioModal] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [leveledUpTo, setLeveledUpTo] = useState<number>(1);

  // Sync stats to localStorage whenever they update
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  const updateStats = (newFields: Partial<UserStats>) => {
    setStats((prev) => {
      const updated = { ...prev, ...newFields };
      return updated;
    });
  };

  const handleSelectLanguage = (lang: Language) => {
    updateStats({ selectedLanguage: lang, activeTab: 'map' });
    setActiveChallenge(null);
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
  };

  const handleChallengeSuccess = (earnedXp: number, earnedGems: number) => {
    const oldLevel = calculateLevel(stats.xp).level;
    const newXp = stats.xp + earnedXp;
    const newLevel = calculateLevel(newXp).level;

    const newGems = stats.gems + earnedGems;
    const newCompleted = activeChallenge && !stats.completedChallengeIds.includes(activeChallenge.id)
      ? [...stats.completedChallengeIds, activeChallenge.id]
      : stats.completedChallengeIds;

    // Progress daily quests
    const updatedDaily = stats.dailyQuests.map(q => {
      if (q.id.startsWith('quest_solve_3')) {
        return { ...q, current: Math.min(q.target, q.current + 1) };
      }
      if (q.id.startsWith('quest_perfect')) {
        return { ...q, current: Math.min(q.target, q.current + 1) };
      }
      return q;
    });

    const newDoubleXp = Math.max(0, stats.doubleXpRemaining - 1);

    updateStats({
      xp: newXp,
      gems: newGems,
      completedChallengeIds: newCompleted,
      solvedChallengesCount: stats.solvedChallengesCount + 1,
      perfectRunsCount: stats.perfectRunsCount + 1,
      dailyQuests: updatedDaily,
      doubleXpRemaining: newDoubleXp,
    });

    if (newLevel > oldLevel) {
      setLeveledUpTo(newLevel);
      setShowLevelUpModal(true);
      playSound('levelUp', stats.soundEnabled);
    }
  };

  const handleDeductHeart = () => {
    if (stats.hearts > 0) {
      updateStats({
        hearts: stats.hearts - 1,
        lastHeartRegenTime: Date.now(),
      });
    }
  };

  const handleClaimQuest = (questId: string, xpReward: number, gemsReward: number) => {
    const updatedDaily = stats.dailyQuests.map(q => {
      if (q.id === questId) {
        return { ...q, claimed: true };
      }
      return q;
    });

    const oldLevel = calculateLevel(stats.xp).level;
    const newXp = stats.xp + xpReward;
    const newLevel = calculateLevel(newXp).level;

    updateStats({
      xp: newXp,
      gems: stats.gems + gemsReward,
      dailyQuests: updatedDaily,
    });

    if (newLevel > oldLevel) {
      setLeveledUpTo(newLevel);
      setShowLevelUpModal(true);
      playSound('levelUp', stats.soundEnabled);
    }
  };

  const handleSprintFinished = (earnedXp: number, score: number) => {
    const oldLevel = calculateLevel(stats.xp).level;
    const newXp = stats.xp + earnedXp;
    const newLevel = calculateLevel(newXp).level;

    // Progress sprint daily quest
    const updatedDaily = stats.dailyQuests.map(q => {
      if (q.id.startsWith('quest_sprint')) {
        return { ...q, current: Math.min(q.target, q.current + 1) };
      }
      return q;
    });

    updateStats({
      xp: newXp,
      speedSprintHighScore: Math.max(stats.speedSprintHighScore, score),
      dailyQuests: updatedDaily,
    });

    if (newLevel > oldLevel) {
      setLeveledUpTo(newLevel);
      setShowLevelUpModal(true);
      playSound('levelUp', stats.soundEnabled);
    }
  };

  // Determine theme styling wrapper
  const getThemeClass = () => {
    switch (stats.themeId) {
      case 'theme_cyberpunk':
        return 'theme-cyberpunk bg-slate-950 text-slate-100';
      case 'theme_matrix':
        return 'theme-matrix bg-black text-emerald-400';
      case 'theme_sunset':
        return 'theme-sunset bg-[#130d1e] text-slate-100';
      default:
        return 'bg-blue-50/50 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white ${getThemeClass()}`}>
      
      {/* Top Main Navigation Bar */}
      <Navbar
        stats={stats}
        onUpdateStats={updateStats}
        onOpenDaily={() => setShowDailyModal(true)}
        onOpenShop={() => {
          setActiveChallenge(null);
          updateStats({ activeTab: 'shop' });
        }}
        onOpenLeaderboard={() => {
          setActiveChallenge(null);
          updateStats({ activeTab: 'leaderboard' });
        }}
        onOpenSprint={() => {
          setActiveChallenge(null);
          updateStats({ activeTab: 'sprint' });
        }}
        onOpenPlayground={() => {
          setActiveChallenge(null);
          updateStats({ activeTab: 'playground' });
        }}
        onOpenAiStudio={() => setShowAiStudioModal(true)}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Main App Body */}
      <main className="flex-1">
        {activeChallenge ? (
          <ChallengeView
            challenge={activeChallenge}
            stats={stats}
            onBack={() => setActiveChallenge(null)}
            onSuccess={handleChallengeSuccess}
            onDeductHeart={handleDeductHeart}
            onOpenShop={() => {
              setActiveChallenge(null);
              updateStats({ activeTab: 'shop' });
            }}
          />
        ) : stats.activeTab === 'map' ? (
          <QuestMap
            stats={stats}
            onSelectChallenge={handleSelectChallenge}
            onOpenDaily={() => setShowDailyModal(true)}
            onOpenAiStudio={() => setShowAiStudioModal(true)}
            onSelectLanguage={handleSelectLanguage}
          />
        ) : stats.activeTab === 'leaderboard' ? (
          <LeaderboardView stats={stats} />
        ) : stats.activeTab === 'shop' ? (
          <ShopView stats={stats} onUpdateStats={updateStats} />
        ) : stats.activeTab === 'sprint' ? (
          <SpeedSprintGame
            stats={stats}
            onBack={() => updateStats({ activeTab: 'map' })}
            onFinishGame={handleSprintFinished}
          />
        ) : stats.activeTab === 'playground' ? (
          <CodePlayground
            stats={stats}
            onBack={() => updateStats({ activeTab: 'map' })}
          />
        ) : (
          <QuestMap
            stats={stats}
            onSelectChallenge={handleSelectChallenge}
            onOpenDaily={() => setShowDailyModal(true)}
            onOpenAiStudio={() => setShowAiStudioModal(true)}
            onSelectLanguage={handleSelectLanguage}
          />
        )}
      </main>

      {/* Daily Quests & Streak Modal */}
      {showDailyModal && (
        <DailyQuestsModal
          stats={stats}
          onClose={() => setShowDailyModal(false)}
          onClaimQuest={handleClaimQuest}
          onOpenShop={() => {
            setShowDailyModal(false);
            updateStats({ activeTab: 'shop' });
          }}
        />
      )}

      {/* AI Dynamic Challenge Generator Studio */}
      {showAiStudioModal && (
        <DynamicChallengeModal
          stats={stats}
          onClose={() => setShowAiStudioModal(false)}
          onPlayCustomChallenge={(customChallenge) => {
            setShowAiStudioModal(false);
            setActiveChallenge(customChallenge);
          }}
        />
      )}

      {/* Level Up Fanfare Celebration Modal */}
      {showLevelUpModal && (
        <LevelUpModal
          newLevel={leveledUpTo}
          onClose={() => setShowLevelUpModal(false)}
        />
      )}

    </div>
  );
}
