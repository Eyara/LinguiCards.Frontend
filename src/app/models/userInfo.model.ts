export interface UserInfo {
    level: number;
    xp: number;
    xpToNextLevel: number;
    dailyXp: number;
    byTranslation: number;
    byGrammar: number;
    goalStreak: number;
    goalDays: GoalDay[];
    languageStats: LanguageStat[];
}

export interface GoalDay {
    date: string;
    xp: number;
    targetXp: number;
    byTranslation: number;
    byGrammar: number;
    isCompleted: boolean;
}

export interface LanguageStat {
    languageName: string;
    totalWords: number;
    learnedWords: number;
    learnedPercent: number;
    totalTrainingDays: number;
}
