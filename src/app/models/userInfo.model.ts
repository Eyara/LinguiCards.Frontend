export interface UserInfo {
    level: number;
    xp: number;
    xpToNextLevel: number;
    dailyXp: number;
    goalStreak: number;
    completedGoalDays: CompletedGoalDay[];
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

export interface LanguageStat {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
