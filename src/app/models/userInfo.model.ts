export interface UserInfo {
    level: number;
    xp: number;
    xpToNextLevel: number;
    dailyXp: number;
    byTranslation: number;
    byGrammar: number;
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
    xp?: number;
    byTranslation?: number;
    byGrammar?: number;
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
