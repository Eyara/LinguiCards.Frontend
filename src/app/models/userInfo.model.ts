export interface UserInfo {
    level: number;
    xp: number;
    xpToNextLevel: number;
    dailyXp: number;
    goalStreak: number;
    completedGoalDays: CompletedGoalDayInput[];
    languageStats: LanguageStat[];
}

export interface CompletedGoalDay {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
    dayOfYear: number;
    dayNumber: number;
}

// API may return dates as strings in 'YYYY-MM-DD' format
export type CompletedGoalDayInput = CompletedGoalDay | string;

export interface LanguageStat {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
