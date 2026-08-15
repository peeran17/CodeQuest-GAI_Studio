export type Language = 'python' | 'javascript' | 'sql' | 'html_css' | 'rust';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export type ChallengeType = 
  | 'code_editor'      // Write or complete code with test cases
  | 'bug_hunt'         // Spot and fix bug in code snippet
  | 'code_blocks'      // Arrange code lines in correct execution order
  | 'predict_output'   // Predict the console output / outcome
  | 'speed_sprint';    // Fast-paced syntax fill

export interface TestCase {
  input: string;
  expected: string;
  description: string;
  hidden?: boolean;
}

export interface CodeBlockItem {
  id: string;
  text: string;
  correctIndex: number;
}

export interface PredictOption {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  language: Language;
  moduleId: string;
  title: string;
  difficulty: Difficulty;
  type: ChallengeType;
  xpReward: number;
  gemsReward: number;
  story?: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  hint: string;
  tags: string[];
  
  // Type-specific properties
  testCases?: TestCase[];
  bugLine?: number;
  bugExplanation?: string;
  codeBlocks?: CodeBlockItem[];
  predictOptions?: PredictOption[];
  predictPrompt?: string;
  htmlCssPreview?: boolean;
  expectedSqlResult?: Array<Record<string, any>>;
}

export interface CourseModule {
  id: string;
  language: Language;
  title: string;
  description: string;
  order: number;
  icon: string;
  challenges: Challenge[];
}

export interface LanguageTrack {
  id: Language;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  badgeBg: string;
  accentBorder: string;
  description: string;
  modules: CourseModule[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  gemsReward: number;
  claimed: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'challenges' | 'mastery' | 'speed' | 'mentor';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlockedAt?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  costGems: number;
  icon: string;
  category: 'powerup' | 'theme' | 'cosmetic';
  effect: string;
  owned?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Obsidian';
  rank: number;
  isCurrentUser?: boolean;
  title: string;
  favoriteLanguage: Language;
}

export interface UserStats {
  username: string;
  avatar: string;
  themeId: string;
  xp: number;
  level: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  lastHeartRegenTime: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakHistory: string[]; // List of YYYY-MM-DD
  streakFreezeCount: number;
  doubleXpRemaining: number; // number of challenges with 2x XP
  completedChallengeIds: string[];
  solvedChallengesCount: number;
  perfectRunsCount: number;
  speedSprintHighScore: number;
  unlockedBadgeIds: string[];
  inventory: string[];
  soundEnabled: boolean;
  selectedLanguage: Language;
  activeTab: 'map' | 'daily' | 'leaderboard' | 'shop' | 'sprint' | 'playground' | 'ai_studio';
  dailyQuestsDate: string;
  dailyQuests: DailyQuest[];
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  testResults?: {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    description: string;
  }[];
  sqlRows?: Array<Record<string, any>>;
  executionTimeMs: number;
}
