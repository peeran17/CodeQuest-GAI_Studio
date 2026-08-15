import { DailyQuest, UserStats } from '../types';

const STORAGE_KEY = 'codequest_user_v2';

export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function generateDailyQuests(dateStr: string): DailyQuest[] {
  return [
    {
      id: `quest_solve_3_${dateStr}`,
      title: 'Daily Coding Triple',
      description: 'Solve 3 coding exercises or challenges today.',
      target: 3,
      current: 0,
      xpReward: 60,
      gemsReward: 25,
      claimed: false,
      icon: 'Target',
    },
    {
      id: `quest_perfect_${dateStr}`,
      title: 'Precision Master',
      description: 'Pass 1 challenge on your very first try without hints.',
      target: 1,
      current: 0,
      xpReward: 40,
      gemsReward: 15,
      claimed: false,
      icon: 'Sparkles',
    },
    {
      id: `quest_sprint_${dateStr}`,
      title: 'Syntax Sprint Workout',
      description: 'Play 1 round of Syntax Sprint speed typing game.',
      target: 1,
      current: 0,
      xpReward: 30,
      gemsReward: 10,
      claimed: false,
      icon: 'Zap',
    },
  ];
}

export const INITIAL_USER_STATS: UserStats = {
  username: 'CodeChampion',
  avatar: '🚀',
  themeId: 'default',
  xp: 120,
  level: 2,
  gems: 150,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegenTime: Date.now(),
  streak: 3,
  lastActiveDate: getTodayDateStr(),
  streakHistory: [getTodayDateStr()],
  streakFreezeCount: 1,
  doubleXpRemaining: 0,
  completedChallengeIds: ['py_ch_1'],
  solvedChallengesCount: 1,
  perfectRunsCount: 1,
  speedSprintHighScore: 320,
  unlockedBadgeIds: ['first_blood', 'streak_3'],
  inventory: ['streak_freeze'],
  soundEnabled: true,
  selectedLanguage: 'python',
  activeTab: 'map',
  dailyQuestsDate: getTodayDateStr(),
  dailyQuests: generateDailyQuests(getTodayDateStr()),
};

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = 100;

  while (xp >= nextThreshold) {
    level++;
    prevThreshold = nextThreshold;
    nextThreshold = Math.round(prevThreshold + 100 * Math.pow(level, 1.25));
  }

  const currentLevelXp = xp - prevThreshold;
  const neededForLevel = nextThreshold - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / neededForLevel) * 100)));

  return {
    level,
    currentLevelXp,
    nextLevelXp: neededForLevel,
    progressPercent,
  };
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_USER_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserStats(INITIAL_USER_STATS);
      return INITIAL_USER_STATS;
    }
    const parsed: UserStats = JSON.parse(raw);
    
    // Check if daily quests need reset for today
    const today = getTodayDateStr();
    if (parsed.dailyQuestsDate !== today) {
      parsed.dailyQuestsDate = today;
      parsed.dailyQuests = generateDailyQuests(today);
    }

    // Regenerate hearts (1 heart every 30 mins)
    const now = Date.now();
    const minsPassed = Math.floor((now - (parsed.lastHeartRegenTime || now)) / (1000 * 60 * 30));
    if (minsPassed > 0 && parsed.hearts < parsed.maxHearts) {
      parsed.hearts = Math.min(parsed.maxHearts, parsed.hearts + minsPassed);
      parsed.lastHeartRegenTime = now;
    }

    return parsed;
  } catch (err) {
    console.error('Error loading user stats from storage:', err);
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving user stats:', err);
  }
}
